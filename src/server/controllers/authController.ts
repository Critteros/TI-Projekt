import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import { User } from '@prisma/client';
import { z } from 'zod';

import Users from '@/server/models/Users';
import { env } from '$env';
import {
  LogoutResponse,
  Signup,
  SignupResponse,
  SignupSchema,
  TokenResponse,
} from '@/common/dto/auth';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export const JWTSchema = z.object({
  userId: z.string(),
  type: z.enum(['access', 'refresh']),
});

type JWTContent = z.infer<typeof JWTSchema>;

/**
 * Creates JWT token
 * @param contents
 */
export const createJWT = (contents: JWTContent) => {
  return jwt.sign(contents, env.JWT_SECRET, {
    expiresIn: contents.type === 'access' ? '10s' : '1d',
  });
};

/**
 * Attaches the refresh token to the cookies
 * @param res
 * @param jwt
 */
export const setRefreshToken = <T>(res: Response<T>, jwt: string) => {
  return res.cookie('jwt', jwt, {
    httpOnly: true,
    expires: dayjs().add(1, 'day').toDate(),
  });
};

/**
 * Creates and sends new refresh token
 * @param req
 * @param res
 * @param user
 */
const sendRefreshToken = async <T = unknown>(
  req: Request,
  res: Response<T>,
  user: Pick<User, 'id'>,
) => {
  // Set a refresh token
  const refreshToken = createJWT({
    userId: user.id,
    type: 'refresh',
  });

  try {
    await req.app.prisma.token.create({
      data: {
        userId: user.id,
        token: refreshToken,
        expiresAt: dayjs().add(1, 'days').toDate(),
      },
    });
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Could not write to database',
    });
    return;
  }

  return setRefreshToken(res, refreshToken).status(StatusCodes.OK);
};

/**
 * Clears the http only refresh token cookie
 * @param res
 */
export const clearRefreshToken = <T>(res: Response<T>) => {
  return res.clearCookie('jwt');
};

/**
 * Deletes the refresh cookie from the database
 * @param req
 */
export const removeRefreshTokenFromDB = async (req: Request) => {
  const token = req.cookies.jwt;
  if (token) {
    await req.app.prisma.token.deleteMany({
      where: {
        token,
      },
    });
  }
};

/**
 * Retries and verifies the refresh token both on the expiry time and the structure
 * @param req
 */
export const getVerifiedRefreshToken = async (req: Request) => {
  const tokenRaw = req.cookies.jwt;
  try {
    const token = jwt.verify(tokenRaw, env.JWT_SECRET);

    return {
      parsedToken: await JWTSchema.parseAsync(token),
      encodedToken: tokenRaw,
    };
  } catch (e) {
    return null;
  }
};

/**
 * Method used to generate new auth tokens
 * @param req
 * @param res
 */
export const tokenController = async (req: Request, res: Response<TokenResponse>) => {
  // Check if the request have attached refresh token
  const tokenResult = await getVerifiedRefreshToken(req);

  if (!tokenResult) {
    clearRefreshToken(res);
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: getReasonPhrase(StatusCodes.UNAUTHORIZED),
    });
  }

  const { parsedToken: refreshToken, encodedToken: tokenEncoded } = tokenResult;

  // Check if the refresh token points to a valid user
  const prisma = req.app.prisma;
  const result = await prisma.user.findUnique({
    where: {
      id: refreshToken.userId,
    },
    select: {
      login: true,
      id: true,
      activeToken: {
        select: {
          token: true,
          expiresAt: true,
        },
      },
    },
  });

  if (!result) {
    clearRefreshToken(res);
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: getReasonPhrase(StatusCodes.UNAUTHORIZED),
    });
  }

  // Check for token reuse
  if (!result.activeToken.find((el) => el.token === tokenEncoded)) {
    // Token was reused
    // 1) Delete all refresh tokens for the context user
    prisma.token.deleteMany({ where: { userId: refreshToken.userId } });
    clearRefreshToken(res);
    return res.status(StatusCodes.UNAUTHORIZED).json({
      error: getReasonPhrase(StatusCodes.UNAUTHORIZED),
    });
  }

  // Remove old token from db
  await removeRefreshTokenFromDB(req);

  const accessToken = createJWT({
    userId: result.id,
    type: 'access',
  });

  return (await sendRefreshToken(req, res, result))?.json({
    message: 'success',
    token: accessToken,
  });
};

/**
 * Performs the logout action by removing the jwt token
 * @param req
 * @param res
 */
export const logoutController = async (req: Request, res: Response<LogoutResponse>) => {
  await removeRefreshTokenFromDB(req);
  return clearRefreshToken(res).json({
    message: 'success',
  });
};

/**
 * Performs the register action
 * @param req
 * @param res
 */
export const registerController = async (req: Request, res: Response<SignupResponse>) => {
  await removeRefreshTokenFromDB(req);

  // 1) Check if the request data is valid
  const signupRequest: Signup = req.body;
  const isValid = await SignupSchema.safeParseAsync(signupRequest);
  if (!isValid.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Invalid request parameters',
      fields: isValid.error.flatten().fieldErrors,
    });
  }

  // Try to create a new user in the DB
  try {
    const model = new Users(req.app.prisma.user);
    const user = await model.register(signupRequest);

    return (await sendRefreshToken(req, res, user))?.json({
      message: 'success',
    });
  } catch (e) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: (e as Error).message,
    });
  }
};

/**
 * Perform the login action
 * @param req
 * @param res
 */
export const loginController = async (req: Request, res: Response<SignupResponse>) => {
  await removeRefreshTokenFromDB(req);

  // 1) Check if the request data is valid
  const signupRequest: Signup = req.body;
  const isValid = await SignupSchema.safeParseAsync(signupRequest);
  if (!isValid.success) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Invalid request parameters',
      fields: isValid.error.flatten().fieldErrors,
    });
  }

  // 2) Check if the user exists and credentials are correct
  try {
    const model = new Users(req.app.prisma.user);
    const user = await model.login(signupRequest);

    return (await sendRefreshToken(req, res, user))?.json({
      message: 'success',
    });
  } catch (e: unknown) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Invalid login or password',
      fields: {
        login: ['Invalid login or password'],
      },
    });
  }
};

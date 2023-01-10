import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { User } from '@prisma/client';

import Users from '@/server/models/Users';
import { env } from '$env';
import { Signup, SignupResponse, SignupSchema } from '@/common/dto/auth';
import { StatusCodes } from 'http-status-codes';

type JWTContent = {
  userId: string;
  type: 'access' | 'refresh';
};

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
const sendRefreshToken = async (req: Request, res: Response<SignupResponse>, user: User) => {
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
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Could not write to database',
    });
  }

  return setRefreshToken(res, refreshToken).status(StatusCodes.OK).json({
    message: 'success',
  });
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
 * @return true if already authenticated
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
 * Performs the logout action by removing the jwt token
 * @param req
 * @param res
 */
export const logoutController = (req: Request, res: Response) => {
  return clearRefreshToken(res).redirect('/');
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

    return await sendRefreshToken(req, res, user);
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

    return await sendRefreshToken(req, res, user);
  } catch (e: unknown) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: 'Invalid login or password',
      fields: {
        login: ['Invalid login or password'],
      },
    });
  }
};

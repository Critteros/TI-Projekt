import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

import { env } from '$env';
import { JWTSchema } from '@/server/controllers/authController';

export const verifyAccessToken = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (Array.isArray(authHeader) || !authHeader?.startsWith('Bearer ')) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: getReasonPhrase(StatusCodes.FORBIDDEN),
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const verified = jwt.verify(token, env.JWT_SECRET);
    const validatedToken = await JWTSchema.parseAsync(verified);
    if (validatedToken.type === 'refresh') {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: 'Refresh token was sent where access token were expected',
      });
    }
    // Check if given user exists
    const result = await req.app.prisma.user.findUniqueOrThrow({
      where: {
        id: validatedToken.userId,
      },
      select: {
        id: true,
      },
    });
    req.userId = result.id;
    next();
  } catch (e) {
    return res.status(StatusCodes.FORBIDDEN).json({
      error: getReasonPhrase(StatusCodes.FORBIDDEN),
    });
  }
};

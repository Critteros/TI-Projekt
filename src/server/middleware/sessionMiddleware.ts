import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { env } from '$env';
import { JWTSchema } from '@/server/controllers/authController';

/**
 * Sets the session
 * @param req
 * @param res
 * @param next
 */
export const sessionMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  req.session = null;
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (Array.isArray(authHeader) || !authHeader?.startsWith('Bearer ')) return next();
  const token = authHeader.split(' ')[1];

  try {
    const verified = jwt.verify(token, env.JWT_SECRET);
    const validatedToken = await JWTSchema.parseAsync(verified);

    if (validatedToken.type === 'refresh') return next();

    const user = await req.app.prisma.user.findUnique({
      where: {
        id: validatedToken.userId,
      },
    });
    if (user === null) return next();
    req.userId = user.id;

    req.session = user;
  } catch (e) {
    /**/
  }

  return next();
};

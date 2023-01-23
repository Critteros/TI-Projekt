import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

import { env } from '$env';
import { JWTSchema } from '@/server/controllers/authController';
import { Session } from '@/common/dto/session';

export const serverSession = async (req: Request, res: Response, next: NextFunction) => {
  const cookie = req.cookies.jwt;
  res.locals.session = null;

  if (!cookie) {
    return next();
  }

  try {
    const verified = jwt.verify(cookie, env.JWT_SECRET);
    const validatedToken = await JWTSchema.parseAsync(verified);

    const user = await req.app.prisma.user.findUnique({
      where: {
        id: validatedToken.userId,
      },
    });
    if (user === null) return next();

    // Check if token is valid
    const tokenVerify = await req.app.prisma.token.findUnique({
      where: {
        token: cookie,
      },
    });
    if (!tokenVerify) return next();

    res.locals.session = {
      login: user.login,
      userId: user.id,
    } satisfies Session;
  } catch (e) {
    console.error(`Server session error`, e);
  }

  return next();
};

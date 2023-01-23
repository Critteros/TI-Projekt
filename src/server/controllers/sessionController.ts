import { Request, Response } from 'express';
import { SessionResponse } from '@/common/dto/session';
import { StatusCodes } from 'http-status-codes';

export const getSessionInfo = async (req: Request, res: Response<SessionResponse>) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'No session object in request',
    });
  }
  const { login, id } = await req.app.prisma.user.findUniqueOrThrow({
    where: {
      id: userId,
    },
    select: {
      id: true,
      login: true,
    },
  });

  return res.status(StatusCodes.OK).json({
    login,
    userId: id,
  });
};

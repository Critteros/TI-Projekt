import { Request, Response, NextFunction } from 'express';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';

export const requireAuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (req.session === undefined) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: 'Missing session middleware',
    });
  }
  console.log('hello');

  if (req.session) {
    return next();
  }

  return res.status(StatusCodes.UNAUTHORIZED).json({
    error: getReasonPhrase(StatusCodes.UNAUTHORIZED),
  });
};

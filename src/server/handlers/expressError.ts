import { ErrorRequestHandler } from 'express';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';

import { env } from '@/common/settings';

export const errorHandler: () => ErrorRequestHandler = () => (err, req, res, next) => {
  if (env.isDevelopment) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: `Uncaught server error: ${err}`,
    });
  }
  res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ error: getReasonPhrase(StatusCodes.INTERNAL_SERVER_ERROR) });
};

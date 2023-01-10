import express from 'express';

import { router as authRouter } from './auth';

export const router = express.Router();

router.use('/auth', authRouter);

router.get('/', async (req, res) => {
  const prisma = req.app.prisma;
  const user = await prisma.user.findFirst();
  return res.json(user);
});

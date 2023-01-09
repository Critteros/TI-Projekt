import express from 'express';

export const router = express.Router();

router.get('/', async (req, res) => {
  const prisma = req.app.prisma;
  const user = await prisma.user.findFirst();
  return res.json(user);
});

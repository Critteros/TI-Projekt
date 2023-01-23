import express from 'express';

import { router as apiRouter } from './api/router';
import { logoutController } from '@/server/controllers/authController';
import { StatusCodes } from 'http-status-codes';

export const router = express.Router();

router.use('/api', apiRouter);

router.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.render('pages/index');
});

router.get('/profile', async (req, res) => {
  if (!res.locals.session) {
    return res.status(StatusCodes.TEMPORARY_REDIRECT).redirect('/');
  }

  const userId = res.locals.session.userId;

  const settings = await req.app.prisma.settings.findUnique({
    where: {
      userId,
    },
    select: {
      lineThickness: true,
      particleNumber: true,
      connectionDistance: true,
      particleSize: true,
    },
  });

  res.set('Cache-Control', 'no-store');
  res.render('pages/profile', {
    settings: settings
      ? {
          lt: settings.lineThickness.toNumber(),
          pc: settings.particleNumber,
          cd: settings.connectionDistance,
          ps: settings.particleSize.toNumber(),
        }
      : settings,
  });
});

router.get('/register', (req, res) => {
  res.render('pages/register');
});

router.get('/login', (req, res) => {
  res.render('pages/login');
});

router.get('/logout', logoutController);

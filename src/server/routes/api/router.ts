import express from 'express';

import { router as authRouter } from './auth';
import { router as settingsRouter } from './settings';
import { getSessionInfo } from '@/server/controllers/sessionController';
import { requireAuthMiddleware } from '@/server/middleware/requireAuthMiddleware';

export const router = express.Router();

router.use('/auth', authRouter);
router.use('/settings', settingsRouter);

router.get('/session', requireAuthMiddleware, getSessionInfo);

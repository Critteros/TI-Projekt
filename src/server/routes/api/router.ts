import express from 'express';

import { router as authRouter } from './auth';
import { router as settingsRouter } from './settings';
import { getSessionInfo } from '@/server/controllers/sessionController';

export const router = express.Router();

router.use('/auth', authRouter);
router.use('/settings', settingsRouter);

router.get('/session', getSessionInfo);

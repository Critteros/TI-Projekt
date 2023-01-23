import express from 'express';

import { requireAuthMiddleware } from '@/server/middleware/requireAuthMiddleware';

import { getSettings, updateSettings } from '@/server/controllers/settingsController';

export const router = express.Router();

router.use(requireAuthMiddleware);

router.get('/', getSettings);
router.post('/', updateSettings);

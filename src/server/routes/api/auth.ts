import express from 'express';

import {
  loginController,
  registerController,
  logoutController,
  tokenController,
} from '@/server/controllers/authController';

export const router = express.Router();

router.post('/login', loginController);
router.post('/register', registerController);
router.post('/logout', logoutController);
router.get('/token', tokenController);

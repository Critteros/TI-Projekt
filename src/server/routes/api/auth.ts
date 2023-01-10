import express from 'express';

import { loginController, registerController } from '@/server/controllers/authController';

export const router = express.Router();

router.post('/login', loginController);
router.post('/register', registerController);

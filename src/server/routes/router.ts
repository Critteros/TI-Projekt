import express from 'express';

import { router as apiRouter } from './api/router';

export const router = express.Router();

router.use('/api', apiRouter);

router.get('/', (req, res) => {
  res.set('Cache-Control', 'no-store');
  res.render('pages/index');
});

router.get('/register', (req, res) => {
  res.render('pages/register');
});

router.get('/login', (req, res) => {
  res.render('pages/login');
});

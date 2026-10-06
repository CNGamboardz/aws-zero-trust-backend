import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import validate from '../middlewares/validate.js';

const loginSchema = z.object({
  identity: z.string().trim().min(3).max(150),
  password: z.string().min(8).max(128),
});

export default function authRoutes({ authController, authenticate }) {
  const router = Router();

  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Demasiados intentos. Intenta nuevamente más tarde.' },
  });

  router.post('/login', loginLimiter, validate(loginSchema), authController.login);
  router.get('/me', authenticate, authController.me);
  router.post('/logout', authenticate, authController.logout);

  return router;
}

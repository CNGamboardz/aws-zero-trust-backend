import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { env } from './config/env.js';
import { container } from './container.js';
import authRoutes from './interfaces/http/routes/authRoutes.js';
import dashboardRoutes from './interfaces/http/routes/dashboardRoutes.js';
import errorHandler from './interfaces/http/middlewares/errorHandler.js';
import AppError from './domain/errors/AppError.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(helmet());
app.use(express.json({ limit: '20kb' }));
app.use(cors({
  origin: env.CORS_ORIGIN.split(',').map((origin) => origin.trim()),
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.get('/api/health', async (_req, res, next) => {
  try {
    await container.pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch (error) {
    next(error);
  }
});

app.use('/api/auth', authRoutes({
  authController: container.authController,
  authenticate: container.authenticate,
}));

app.use('/api/dashboard', dashboardRoutes({
  dashboardController: container.dashboardController,
  authenticate: container.authenticate,
}));

app.use((_req, _res, next) => next(new AppError('Ruta no encontrada.', 404, 'NOT_FOUND')));
app.use(errorHandler);

export default app;

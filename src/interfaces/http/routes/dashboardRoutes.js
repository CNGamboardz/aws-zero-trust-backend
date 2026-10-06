import { Router } from 'express';
import authorize from '../middlewares/authorize.js';

export default function dashboardRoutes({ dashboardController, authenticate }) {
  const router = Router();
  router.get('/stats', authenticate, authorize('dashboard.view'), dashboardController.stats);
  return router;
}

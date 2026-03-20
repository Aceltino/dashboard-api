import { Router } from 'express';
import { DashboardController } from '../controllers/dashboard.controller';

const router = Router();

const dashboardController = new DashboardController();

router.get('/dashboard', (req, res) => dashboardController.handle(req, res));

export default router;

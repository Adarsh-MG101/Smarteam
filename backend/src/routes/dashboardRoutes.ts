import { Router } from 'express';
import { getUserDashboard, getAdminDashboard } from '../controllers/dashboardController.js';
import { authenticate, requirePermission } from '../middleware/auth.js';

const router = Router();

router.get('/user', authenticate, getUserDashboard);
router.get('/admin', authenticate, requirePermission('VIEW_DASHBOARD'), getAdminDashboard);

export default router;

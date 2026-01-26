import { Router } from 'express';
import { createProject, getProjects } from '../controllers/projectController.js';
import { authenticate, requirePermission } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, requirePermission('CREATE_PROJECT'), createProject);
router.get('/', authenticate, getProjects);

export default router;

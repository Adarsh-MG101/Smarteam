import { Router } from 'express';
import { createTask, getMyTasks, updateTaskStatus, reviewTask, getTaskReviews } from '../controllers/taskController.js';
import { authenticate, requirePermission } from '../middleware/auth.js';

const router = Router();

router.post('/', authenticate, requirePermission('CREATE_TASK'), createTask);
router.get('/my-tasks', authenticate, getMyTasks);
router.patch('/:id/status', authenticate, updateTaskStatus);
router.post('/review', authenticate, requirePermission('REVIEW_TASK'), reviewTask);
router.get('/reviews', authenticate, getTaskReviews);

export default router;

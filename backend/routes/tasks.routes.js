import express from 'express';
import {
  createTask,
  getTasksByProject,
  updateTask,
  deleteTask,
  moveTaskStatus
} from '../controllers/tasksController.js';

const router = express.Router();

router.post('/', createTask);
router.get('/:projectId', getTasksByProject);
router.put('/:taskId', updateTask);
router.delete('/:taskId', deleteTask);
router.patch('/:taskId/status', moveTaskStatus);

export default router;
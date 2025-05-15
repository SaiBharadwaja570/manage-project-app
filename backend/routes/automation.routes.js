import express from 'express';
import {
  createAutomation,
  getAutomationsByProject,
  deleteAutomation
} from '../controllers/automationController.js';
import  authMiddleware   from '../middlewares/auth.middleware.js';

const router = express.Router();

// Protected routes
router.post('/', authMiddleware, createAutomation);
router.get('/:projectId', authMiddleware, getAutomationsByProject);
router.delete('/:id', authMiddleware, deleteAutomation);

export default router;

import express from 'express';
import {
  createProject,
  getProjects,
  inviteUser,
  updateProject,
} from '../controllers/projectController.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/', authMiddleware, createProject);
router.get('/', authMiddleware, getProjects);
router.post('/:id/invite', authMiddleware, inviteUser);
router.patch('/:id', authMiddleware, updateProject);

export default router;
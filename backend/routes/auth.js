import express from 'express';
import { signup, login, getCurrentUser, firebaseLogin } from '../controllers/authController.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.get('/me', authenticate, getCurrentUser);
router.post('/firebase-login', firebaseLogin);

export default router;

import express from 'express';
import { verifyFirebaseToken } from '../middlewares/verifyFirebaseToken.js';
import { login, currUser } from '../controllers/authController.js';


const router = express.Router();

router.post('/login', verifyFirebaseToken, login);
router.post('/me', verifyFirebaseToken, currUser);

export default router;

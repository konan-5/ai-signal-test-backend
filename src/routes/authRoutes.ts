import express from 'express';
import { registerUser, verifyEmail, loginUser } from '../controllers/authController';

const router = express.Router();

// Ensure that registerUser is typed correctly
router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.post('/login', loginUser);

export default router;

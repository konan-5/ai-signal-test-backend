import express from 'express';
import { registerUser, verifyEmail } from '../controllers/authController';

const router = express.Router();

// Ensure that registerUser is typed correctly
router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);

export default router;

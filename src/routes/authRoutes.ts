import express, { Request, Response } from 'express';
import { registerUser, verifyEmail, loginUser, googleLogin, setPassword } from '../controllers/authController';

const router = express.Router();

// Ensure that registerUser is typed correctly
router.post('/register', registerUser);
router.get('/verify-email', verifyEmail);
router.post('/login', loginUser);
router.post('/google-login', googleLogin);
router.post('/set-password', setPassword);
export default router;

import express from 'express';
import { registerUser } from '../controllers/authController';

const router = express.Router();

// Ensure that registerUser is typed correctly
router.post('/register', registerUser);

export default router;

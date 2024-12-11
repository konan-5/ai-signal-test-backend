import express, { Request, Response } from 'express';
import User from '../models/authModel';
import { authenticate } from '../middlewares/authMiddleware';
import { getDashboardData } from '../controllers/dashboardController';

const router = express.Router();

router.get('/dashboard', authenticate, getDashboardData);
router.get('/user', authenticate, async (req: Request, res: Response) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId)
            .select('email created_unix') // Select email and created_unix fields
            .lean();

        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return
        }
        res.json({ email: user.email, created_unix: user.created_unix });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user data' });
    }
});

export default router;

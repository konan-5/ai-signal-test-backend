import { Request, Response } from 'express';
import { dashboardData } from '../mock/dashboard';

export const getDashboardData = async (req: Request, res: Response) => {
    try {
        res.status(200).json(dashboardData);
    } catch (error) {
        res.status(500).json({ message: "Error fetching dashboard data" });
    }
};
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user: jwt.JwtPayload;
        }
    }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {

    try {
        const authHeader = req.header('Authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Access denied. No token provided.' })
            return;
        }

        const token = authHeader.split(' ')[1];
        const JWT_SECRET = process.env.JWT_SECRET;

        if (!JWT_SECRET) {
            throw new Error('JWT_SECRET is not defined');
        }

        const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
        req.user = decoded;

        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ error: 'Invalid token.' })
            return;
        }
        res.status(500).json({ error: 'Internal server error.' })
    }
};

import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/authModel';
import { sendVerificationEmail } from '../utils/emailUtils';

const generateVerificationToken = (email: string): string => {
    return jwt.sign({ email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
};


export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {

        const email = req.body.email;
        const password = req.body.password;

        if (!email || !password) {
            res.status(400).send('Email and password are required');
            return;
        }

        const userExists = await User.findOne({ email: email });

        if (userExists) {
            res.status(400).send('Email already in use.');
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({
            email,
            password: hashedPassword,
        });

        await newUser.save();

        const verificationToken = generateVerificationToken(email);

        const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`

        await sendVerificationEmail(email, verificationLink);

        res.status(201).send('Registration successful. Please verify your email.');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('An error occurred while registering the user.');
    }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.query;

    if (!token) {
        res.status(400).send('Token is required.')
        return
    }

    try {
        const decoded = jwt.verify(token as string, process.env.JWT_SECRET || 'secret') as { email: string };

        const user = await User.findOne({ email: decoded.email });
        if (!user) {
            res.status(404).send('User not found.')
            return;
        }

        if (user.verification) {
            res.status(400).send('Email is already verified.');
            return;
        }

        user.verification = true;
        await user.save();

        res.status(200).send('Email verified successfully.');

    } catch (err) {
        console.error(err);
        res.status(400).send('Invalid or expired token.');
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).send('Could not find user with this email.')
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).send('Password is incorrect.')
            return;
        }

        if (!user.verification) {
            const verificationToken = generateVerificationToken(email);
            const verificationLink = `${process.env.FRONTEND_URL}/verify-email?token=${verificationToken}`;
            await sendVerificationEmail(email, verificationLink);
            res.status(400).send('Please verify your email. A new verification link has been sent.')
            return;
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
        res.status(200).send(token);
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('An error occurred during login.');
    }
};

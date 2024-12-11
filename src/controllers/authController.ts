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

        console.log('Request body:', email, password);
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



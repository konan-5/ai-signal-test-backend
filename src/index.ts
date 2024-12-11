import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import multer from 'multer';
import protectedRoutes from './routes/protectedRoutes';

dotenv.config();
const upload = multer();

const corsOptions = {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

const app = express();
app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));
app.use(upload.none()); 
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-signals').then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.log('Error connecting to MongoDB', err);
});

app.use('/api', protectedRoutes);
app.use('/api/auth', authRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});

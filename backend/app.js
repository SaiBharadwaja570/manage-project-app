import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import projectRoutes from './routes/project.routes.js'
import tasksRoutes from './routes/tasks.routes.js'
import automationRoutes from './routes/automation.routes.js'

dotenv.config();

const app = express();

// Middleware -- comes in-between req and res
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/project', projectRoutes);
app.use('/api/automation', automationRoutes);
app.use('/api/tasks', tasksRoutes);

export default app;

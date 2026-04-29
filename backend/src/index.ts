import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import taskRoutes from './routes/task/taskRoutes';
import taskBoardRoutes from './routes/task/taskBoardRoutes';
import taskGroupRoutes from './routes/task/taskGroupRoutes';
import eventRoutes from './routes/eventRoutes';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

import sequelize from './config/database';
import { dateParserMiddleware } from './middleware/dateParserMiddleware';
import { initNotificationJob } from './jobs/notificationJob';

import './models'; 

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;

const allowedOrigins = [
    process.env.FRONTEND_URL_PROD as string
];

if (process.env.NODE_ENV !== 'production') {
    allowedOrigins.push(process.env.FRONTEND_URL_DEV as string);
}

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));
app.use(express.json());

// Middlewares
app.use(dateParserMiddleware);

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/task-boards', taskBoardRoutes);
app.use('/api/task-groups', taskGroupRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

const startServer = async (): Promise<void> => {
    try {
        await sequelize.sync({ alter: true }); 

        console.log('Database connected and synced successfully.');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);

            initNotificationJob();
            console.log('Cron notification job initialized.');
        });
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

startServer();

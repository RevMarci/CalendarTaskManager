import express, { Application } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';

import taskRoutes from './routes/taskRoutes';
import eventRoutes from './routes/eventRoutes';
import authRoutes from './routes/authRoutes';
import sequelize from './config/database';

import './models'; 

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT as string, 10) || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);

const startServer = async (): Promise<void> => {
    try {
        await sequelize.sync({ alter: true }); 

        console.log('Database connected and synced successfully.');

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};

startServer();
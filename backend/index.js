import express from 'express';
import cors from 'cors';
import sequelize from './config/database.js';
import dotenv from 'dotenv';

import taskRoutes from './routes/taskRoutes.js';
import eventRoutes from './routes/eventRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config({ path: '../.env' });

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.DEV_BE_PORT || 5000;

app.get('', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

app.use('/api/auth', authRoutes);

app.use('/api/tasks', taskRoutes);
app.use('/api/events', eventRoutes);

// Start app
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');
        await sequelize.sync({ alter: true });

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

startServer();

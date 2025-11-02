import express from 'express';
import sequelize from './config/database.js';

import taskRoutes from './routes/taskRoutes.js';
import eventRoutes from './routes/eventRoutes.js';

import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

const app = express();
app.use(express.json());

const PORT = process.env.DEV_BE_PORT;

// Start app
async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('Database connected!');
        await sequelize.sync();

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
}

// Endpoints
app.get('', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

app.use('/api/tasks', taskRoutes);
app.use('/api/events', eventRoutes);

startServer();

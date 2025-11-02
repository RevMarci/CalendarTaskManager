import dotenv from 'dotenv'
import express from 'express';

dotenv.config({ path: '../.env' })

const app = express();
app.use(express.json());

const PORT = process.env.DEV_BE_PORT;

// Start app
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// Endpoints
app.get('', (req, res) => {
    res.json({ message: 'Backend is running!' });
});

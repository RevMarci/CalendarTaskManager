import express from 'express';
import Task from '../models/task.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const task = await Task.create(req.body);

        res.status(201).json({
            message: 'Task created successfully',
            data: task,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Failed to create task',
            error: error.message,
        });
    }
});

router.get('/', async (req, res) => {
    const tasks = await Task.findAll();
    res.json(tasks);
});

router.get('/:id', async (req, res) => {
    const task = await Task.findByPk(req.params.id);

    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }

    res.json({
        message: 'Task found successfully',
        data: task,
    });
});

router.put('/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);

        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        await task.update(req.body);

        res.json({
            message: 'Task updated successfully',
            data: task,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Failed to update task',
            error: error.message,
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const task = await Task.findByPk(req.params.id);

        if (!task) {
            return res.status(404).json({ error: 'Task not found' });
        }

        await task.destroy();

        res.json({ message: 'Task deleted' });
    } catch (error) {
        res.status(400).json({
            message: 'Failed to delete task',
            error: error.message,
        });
    }
});

export default router;

import express, { Request, Response } from 'express';
import { Task } from '../models';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', async (req: Request, res: Response) => {
    try {
        console.log(`Fetching tasks for user ID: ${req.user?.id}`);
        
        const tasks = await Task.findAll({
            where: { userId: req.user!.id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error in GET /api/tasks:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const task = await Task.findOne({
            where: { id: req.params.id, userId: req.user!.id }
        });

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        res.status(200).json(task);
    } catch (error) {
        console.error(`Error in GET /api/tasks/${req.params.id}:`, error);
        res.status(500).json({ message: 'Error fetching task' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const { title, description, status } = req.body;
        
        if (!title) {
             res.status(400).json({ message: 'Title is required' });
             return;
        }

        const task = await Task.create({
            title,
            description,
            status: status || 'pending',
            userId: req.user!.id
        });
        
        res.status(201).json(task);
    } catch (error) {
        console.error('Error in POST /api/tasks:', error);
        res.status(500).json({ message: 'Error creating task' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const task = await Task.findOne({
            where: { id: req.params.id, userId: req.user!.id }
        });

        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        await task.destroy();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error('Error in DELETE /api/tasks:', error);
        res.status(500).json({ message: 'Error deleting task' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const task = await Task.findOne({
            where: { id: req.params.id, userId: req.user!.id }
        });

        if (!task) {
             res.status(404).json({ message: 'Task not found' });
             return;
        }

        const updatedTask = await task.update(req.body);
        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error in PUT /api/tasks:', error);
        res.status(500).json({ message: 'Error updating task' });
    }
});

export default router;
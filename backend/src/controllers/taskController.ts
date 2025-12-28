import { Request, Response } from 'express';
import * as taskService from '../services/taskService';

export const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await taskService.getAllTasks(req.user!.id);
        res.status(200).json(tasks);
    } catch (error) {
        console.error('Error in getTasks:', error);
        res.status(500).json({ message: 'Error fetching tasks' });
    }
};

export const getTask = async (req: Request, res: Response) => {
    try {
        const task = await taskService.getTaskById(req.params.id, req.user!.id);
        
        if (!task) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }
        
        res.status(200).json(task);
    } catch (error) {
        console.error(`Error in getTask (${req.params.id}):`, error);
        res.status(500).json({ message: 'Error fetching task' });
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, status } = req.body;

        if (!title) {
            res.status(400).json({ message: 'Title is required' });
            return;
        }

        const task = await taskService.createTask({ title, description, status }, req.user!.id);
        res.status(201).json(task);
    } catch (error) {
        console.error('Error in createTask:', error);
        res.status(500).json({ message: 'Error creating task' });
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const result = await taskService.deleteTask(req.params.id, req.user!.id);

        if (!result) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error('Error in deleteTask:', error);
        res.status(500).json({ message: 'Error deleting task' });
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const updatedTask = await taskService.updateTask(req.params.id, req.user!.id, req.body);

        if (!updatedTask) {
            res.status(404).json({ message: 'Task not found' });
            return;
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        console.error('Error in updateTask:', error);
        res.status(500).json({ message: 'Error updating task' });
    }
};
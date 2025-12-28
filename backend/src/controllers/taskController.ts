import { Request, Response } from 'express';
import * as taskService from '../services/taskService';
import { sendSuccess, sendError } from '../utils/response';

export const getTasks = async (req: Request, res: Response) => {
    try {
        const tasks = await taskService.getAllTasks(req.user!.id);
        sendSuccess(res, tasks, 'Tasks fetched successfully');
    } catch (error) {
        console.error('Error in getTasks:', error);
        sendError(res, 'Error fetching tasks', 500, error);
    }
};

export const getTask = async (req: Request, res: Response) => {
    try {
        const task = await taskService.getTaskById(req.params.id, req.user!.id);
        
        if (!task) {
            return sendError(res, 'Task not found', 404);
        }
        
        sendSuccess(res, task);
    } catch (error) {
        console.error(`Error in getTask (${req.params.id}):`, error);
        sendError(res, 'Error fetching task', 500, error);
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, status } = req.body;

        if (!title) {
            return sendError(res, 'Title is required', 400);
        }

        const task = await taskService.createTask({ title, description, status }, req.user!.id);
        sendSuccess(res, task, 'Task created successfully', 201);
    } catch (error) {
        console.error('Error in createTask:', error);
        sendError(res, 'Error creating task', 500, error);
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const result = await taskService.deleteTask(req.params.id, req.user!.id);

        if (!result) {
            return sendError(res, 'Task not found', 404);
        }

        sendSuccess(res, { id: req.params.id }, 'Task deleted successfully');
    } catch (error) {
        console.error('Error in deleteTask:', error);
        sendError(res, 'Error deleting task', 500, error);
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const updatedTask = await taskService.updateTask(req.params.id, req.user!.id, req.body);

        if (!updatedTask) {
            return sendError(res, 'Task not found', 404);
        }

        sendSuccess(res, updatedTask, 'Task updated successfully');
    } catch (error) {
        console.error('Error in updateTask:', error);
        sendError(res, 'Error updating task', 500, error);
    }
};
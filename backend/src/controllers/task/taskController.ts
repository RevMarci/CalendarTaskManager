import { Request, Response } from 'express';
import * as taskService from '../../services/task/taskService';
import { sendSuccess, sendError } from '../../utils/response';

export const getTasks = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return sendError(res, 'User not identified', 401);

        const tasks = await taskService.getAllTasks(userId);
        sendSuccess(res, tasks, 'Tasks fetched successfully');
    } catch (error) {
        console.error('Error in getTasks:', error);
        sendError(res, 'Error fetching tasks', 500, error as Error);
    }
};

export const getTask = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return sendError(res, 'User not identified', 401);

        const task = await taskService.getTaskById(Number(req.params.id), userId);
        
        if (!task) {
            return sendError(res, 'Task not found', 404);
        }
        
        sendSuccess(res, task);
    } catch (error) {
        console.error(`Error in getTask (${req.params.id}):`, error);
        sendError(res, 'Error fetching task', 500, error as Error);
    }
};

export const createTask = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return sendError(res, 'User not identified', 401);

        const { title, description, status, deadLine, duration, startTime, taskGroupId } = req.body;

        if (!title) {
            return sendError(res, 'Title is required', 400);
        }

        if (!taskGroupId) {
            return sendError(res, 'taskGroupId is required', 400);
        }

        const task = await taskService.createTask({ 
            title, 
            description, 
            status, 
            deadLine, 
            duration, 
            startTime,
            taskGroupId: Number(taskGroupId)
        }, userId);
        
        sendSuccess(res, task, 'Task created successfully', 201);
    } catch (error) {
        const err = error as Error;
        console.error('Error in createTask:', err);
        if (err.message === 'Task group not found or unauthorized') {
            return sendError(res, err.message, 404);
        }
        sendError(res, 'Error creating task', 500, err);
    }
};

export const deleteTask = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return sendError(res, 'User not identified', 401);

        const result = await taskService.deleteTask(Number(req.params.id), userId);

        if (!result) {
            return sendError(res, 'Task not found', 404);
        }

        sendSuccess(res, { id: req.params.id }, 'Task deleted successfully');
    } catch (error) {
        console.error('Error in deleteTask:', error);
        sendError(res, 'Error deleting task', 500, error as Error);
    }
};

export const updateTask = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.id;
        if (!userId) return sendError(res, 'User not identified', 401);

        const updatedTask = await taskService.updateTask(Number(req.params.id), userId, req.body);

        if (!updatedTask) {
            return sendError(res, 'Task not found or unauthorized', 404);
        }

        sendSuccess(res, updatedTask, 'Task updated successfully');
    } catch (error) {
        const err = error as Error;
        console.error('Error in updateTask:', err);
        if (err.message === 'Target task group not found or unauthorized') {
            return sendError(res, err.message, 403);
        }
        sendError(res, 'Error updating task', 500, err);
    }
};
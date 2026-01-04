import { Request, Response } from 'express';
import * as groupService from '../../services/task/taskGroupService';
import { sendSuccess, sendError } from '../../utils/response';

export const getGroups = async (req: Request, res: Response): Promise<void> => {
    try {
        const { taskBoardId } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return sendError(res, 'User not identified', 401);
        }

        const groups = await groupService.getTaskGroups(Number(taskBoardId), userId);
        
        return sendSuccess(res, groups, 'Task groups fetched successfully');
    } catch (error) {
        return sendError(res, 'Failed to fetch task groups', 500, error as Error);
    }
};

export const getGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return sendError(res, 'User not identified', 401);
        }

        const group = await groupService.getTaskGroupById(Number(id), userId);
        
        if (!group) {
            return sendError(res, 'Task group not found', 404);
        }

        return sendSuccess(res, group, 'Task group fetched successfully');
    } catch (error) {
        return sendError(res, 'Failed to fetch task group', 500, error as Error);
    }
};

export const createGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, taskBoardId } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return sendError(res, 'User not identified', 401);
        }

        if (!title || !taskBoardId) {
            return sendError(res, 'Title and taskBoardId are required', 400);
        }

        const newGroup = await groupService.createTaskGroup(
            { title, taskBoardId },
            userId
        );

        return sendSuccess(res, newGroup, 'Task group created successfully', 201);
    } catch (error) {
        const errorMessage = (error as Error).message;
        if (errorMessage === 'Task board not found or unauthorized') {
            return sendError(res, errorMessage, 404);
        }
        return sendError(res, 'Failed to create task group', 500, error as Error);
    }
};

export const updateGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title, position } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return sendError(res, 'User not identified', 401);
        }

        const updatedGroup = await groupService.updateTaskGroup(
            Number(id),
            userId,
            { title }
        );

        return sendSuccess(res, updatedGroup, 'Task group updated successfully');
    } catch (error) {
        const errorMessage = (error as Error).message;
        if (errorMessage === 'Task group not found or unauthorized') {
            return sendError(res, errorMessage, 404);
        }
        return sendError(res, 'Failed to update task group', 500, error as Error);
    }
};

export const deleteGroup = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return sendError(res, 'User not identified', 401);
        }

        await groupService.deleteTaskGroup(Number(id), userId);

        return sendSuccess(res, 'Task group deleted successfully');
    } catch (error) {
        const errorMessage = (error as Error).message;
        if (errorMessage === 'Task group not found or unauthorized') {
            return sendError(res, errorMessage, 404);
        }
        return sendError(res, 'Failed to delete task group', 500, error as Error);
    }
};
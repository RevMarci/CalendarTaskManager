import { Request, Response } from 'express';
import * as boardService from '../../services/task/taskBoardService';
import { sendSuccess, sendError } from '../../utils/response';

export const createBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return sendError(res, 'User not identified', 401);
        }

        if (!title) {
            return sendError(res, 'Title is required', 400);
        }

        const newBoard = await boardService.createTaskBoard({ title }, userId);

        return sendSuccess(res, newBoard, 'Board created successfully', 201);
    } catch (error) {
        return sendError(res, 'Failed to create board', 500, error as Error);
    }
};

export const getBoards = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return sendError(res, 'User not identified', 401);
        }

        const boards = await boardService.getAllTaskBoards(userId);

        return sendSuccess(res, boards, 'Boards retrieved successfully');
    } catch (error) {
        return sendError(res, 'Failed to retrieve boards', 500, error as Error);
    }
};

export const getBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return sendError(res, 'User not identified', 401);
        }

        const board = await boardService.getTaskBoardById(Number(id), userId);

        if (!board) {
            return sendError(res, 'Board not found', 404);
        }

        return sendSuccess(res, board, 'Board retrieved successfully');
    } catch (error) {
        return sendError(res, 'Failed to retrieve board', 500, error as Error);
    }
};

export const updateBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        const userId = req.user?.id;

        if (!userId) {
            return sendError(res, 'User not identified', 401);
        }

        const updatedBoard = await boardService.updateTaskBoard(Number(id), userId, { title });

        return sendSuccess(res, updatedBoard, 'Board updated successfully');
    } catch (error) {
        const errorMessage = (error as Error).message;
        if (errorMessage === 'Task board not found or unauthorized') {
            return sendError(res, errorMessage, 404);
        }
        return sendError(res, 'Failed to update board', 500, error as Error);
    }
};

export const deleteBoard = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return sendError(res, 'User not identified', 401);
        }

        await boardService.deleteTaskBoard(Number(id), userId);

        return sendSuccess(res, 'Board deleted successfully');
    } catch (error) {
        const errorMessage = (error as Error).message;
        if (errorMessage === 'Task board not found or unauthorized') {
            return sendError(res, errorMessage, 404);
        }
        return sendError(res, 'Failed to delete board', 500, error as Error);
    }
};
import { Request, Response } from 'express';
import { sendSuccess, sendError } from '../utils/response';

export async function getUserProfile(req: Request, res: Response): Promise<void> {
    try {
        if (req.user) {
            sendSuccess(res, {
                id: req.user.id,
                username: req.user.username,
                email: req.user.email,
            }, 'User profile retrieved successfully');
        } else {
            sendError(res, 'User not found', 404);
        }
    } catch (error) {
        console.error('Get profile error:', error);
        sendError(res, 'Server error while fetching profile', 500);
    }
}

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models';
import { sendSuccess, sendError } from '../utils/response';

export async function getUserProfile(req: Request, res: Response): Promise<void> {
    try {
        if (req.user) {
            const dbUser = await User.findByPk(req.user.id);

            sendSuccess(res, {
                id: req.user.id,
                email: req.user.email,
                hasGoogleId: !!req.user.googleId, 
                hasPassword: !!(dbUser && dbUser.password),
            }, 'User profile retrieved successfully');
        } else {
            sendError(res, 'User not found', 404);
        }
    } catch (error) {
        console.error('Get profile error:', error);
        sendError(res, 'Server error while fetching profile', 500);
    }
}

export async function changePassword(req: Request, res: Response): Promise<void> {
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body || {};
        const userId = req.user?.id;

        if (!userId) {
            return sendError(res, 'Unauthorized', 401);
        }

        if (!newPassword || !confirmPassword) {
            return sendError(res, 'Please provide the new password and its confirmation', 400);
        }

        if (newPassword !== confirmPassword) {
            return sendError(res, 'New passwords do not match', 400);
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return sendError(res, 'User not found', 404);
        }

        if (user.password) {
            if (!oldPassword) {
                return sendError(res, 'Please provide your current password', 400);
            }
            
            const isMatch = await bcrypt.compare(oldPassword, user.password);
            
            if (!isMatch) {
                return sendError(res, 'Incorrect current password', 400);
            }
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(newPassword, salt);

        user.password = hashedPassword;
        await user.save();

        sendSuccess(res, null, 'Password updated successfully');
    } catch (error) {
        console.error('Change password error:', error);
        sendError(res, 'Server error while updating password', 500);
    }
}

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { sendSuccess, sendError } from '../utils/response';

const generateToken = (id: number): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

export const registerUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return sendError(res, 'Please add all fields', 400);
        }

        const userExists = await User.findOne({ where: { username } });

        if (userExists) {
            return sendError(res, 'User already exists', 400);
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            password: hashedPassword,
        });

        if (user) {
            sendSuccess(res, {
                id: user.id,
                username: user.username,
                token: generateToken(user.id),
            }, 'User registered successfully', 201);
        } else {
            sendError(res, 'Invalid user data', 400);
        }
    } catch (error) {
        console.error('Register error:', error);
        sendError(res, 'Server error during registration', 500, error);
    }
};

export const loginUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });

        if (user && (await bcrypt.compare(password, user.password))) {
            sendSuccess(res, {
                id: user.id,
                username: user.username,
                token: generateToken(user.id),
            }, 'Login successful');
        } else {
            sendError(res, 'Invalid credentials', 401);
        }
    } catch (error) {
        console.error('Login error:', error);
        sendError(res, 'Server error during login', 500, error);
    }
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
    if (req.user) {
        sendSuccess(res, {
            id: req.user.id,
            username: req.user.username,
        });
    } else {
         sendError(res, 'User not found', 404);
    }
};
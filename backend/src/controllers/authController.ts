import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models';
import { sendSuccess, sendError } from '../utils/response';
import { OAuth2Client } from 'google-auth-library';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

function generateToken(id: number): string {
    return jwt.sign({ id }, process.env.JWT_SECRET as string, {
        expiresIn: '30d',
    });
};

export async function registerUser (req: Request, res: Response): Promise<void> {
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

export async function loginUser(req: Request, res: Response): Promise<void> {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ where: { username } });

        if (!user) {
            return sendError(res, 'Invalid credentials', 401);
        }

        if (!user.password) {
            return sendError(res, 'This account is linked to an external provider. Please use Google Login.', 401);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {
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

export async function getMe (req: Request, res: Response): Promise<void> {
    if (req.user) {
        sendSuccess(res, {
            id: req.user.id,
            username: req.user.username,
        });
    } else {
         sendError(res, 'User not found', 404);
    }
};

export async function googleLogin(req: Request, res: Response): Promise<void> {
    try {
        const { credential } = req.body;

        if (!credential) {
            return sendError(res, 'Google token is missing', 400);
        }

        // 1. Verify ID Token from Google
        const ticket = await googleClient.verifyIdToken({
            idToken: credential,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        // 2. Get user info
        const payload = ticket.getPayload();
        if (!payload) {
            return sendError(res, 'Invalid Google token', 400);
        }

        const { sub: googleId, email, name } = payload;

        // 3. Validate user in our database by Google ID or email
        let user = await User.findOne({ where: { googleId } });

        if (!user && email) {
            user = await User.findOne({ where: { email } });
            if (user) {
                user.googleId = googleId;
                await user.save();
            }
        }

        // 4. Create user if doesn't exist
        if (!user) {
            user = await User.create({
                username: name || (email ? email.split('@')[0] : 'GoogleUser'),
                email: email,
                googleId: googleId,
            });
        }

        // 5. Generate JWT
        sendSuccess(res, {
            id: user.id,
            username: user.username,
            token: generateToken(user.id),
        }, 'Google login successful', 200);

    } catch (error) {
        console.error('Google login error:', error);
        sendError(res, 'Server error during Google login', 500, error);
    }
};

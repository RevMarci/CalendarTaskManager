import { Response } from 'express';

interface ApiResponse<T> {
    success: true;
    message: string;
    data: T;
    meta?: any;
}

interface ApiError {
    success: false;
    message: string;
    error?: any;
}

export const sendSuccess = <T>(
    res: Response, 
    data: T, 
    message: string = 'Success', 
    statusCode: number = 200,
    meta?: any
) => {
    const response: ApiResponse<T> = {
        success: true,
        message,
        data,
    };

    if (meta) {
        response.meta = meta;
    }

    res.status(statusCode).json(response);
};

export const sendError = (
    res: Response, 
    message: string, 
    statusCode: number = 500, 
    error?: any
) => {
    const response: ApiError = {
        success: false,
        message,
    };

    if (error && process.env.NODE_ENV === 'development') {
        response.error = error instanceof Error ? error.message : error;
    }

    res.status(statusCode).json(response);
};
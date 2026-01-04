import { Request, Response, NextFunction } from 'express';

// ISO 8601 dátum formátum regex
const isoDateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/;

// Regex to identify date-related fields
const dateKeyRegex = /(date|time|at|start|end|deadline)$/i;

export function dateParserMiddleware(req: Request, res: Response, next: NextFunction): void {
    if (req.body) {
        req.body = parseObject(req.body);
    }
    next();
};

function parseObject(data: any): any {
    if (data === null || typeof data !== 'object') {
        return data;
    }

    for (const key of Object.keys(data)) {
        const value = data[key];

        if (isIsoDateString(value) && isDateKey(key)) {
            data[key] = new Date(value);
        } 
        else if (typeof value === 'object') {
            parseObject(value);
        }
    }

    return data;
};

function isIsoDateString(value: any): boolean {
    return value && typeof value === 'string' && isoDateRegex.test(value);
};

function isDateKey(key: string): boolean {
    return dateKeyRegex.test(key);
};

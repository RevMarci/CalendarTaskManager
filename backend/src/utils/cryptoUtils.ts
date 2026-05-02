import crypto from 'crypto';

function sortObjectKeys(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map(sortObjectKeys);
    }

    const sortedKeys = Object.keys(obj).sort();
    const result: any = {};
    
    for (const key of sortedKeys) {
        result[key] = sortObjectKeys(obj[key]);
    }
    
    return result;
}

export function generateStableHash(data: object): string {
    const sortedData = sortObjectKeys(data);
    
    const cleanString = JSON.stringify(sortedData);
    
    return crypto.createHash('sha256').update(cleanString).digest('hex');
}

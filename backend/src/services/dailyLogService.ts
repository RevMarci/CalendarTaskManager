import { DailyLog } from '../models'; 
import { generateStableHash } from '../utils/cryptoUtils';
import { blockchainProvider } from '../providers/blockchainProvider';

import * as taskService from './task/taskService';
import * as eventService from './eventService';
import User from '../models/User';

export async function backupDailyActivity(userId: number, targetDate: Date): Promise<any> {
    // YYYY-MM-DD format
    const dateString = targetDate.toISOString().split('T')[0];

    const dailyData = await gatherDailyData(userId, dateString);
    if (!dailyData) {
        console.log(`No data available for user ${userId} on date ${dateString}.`);
        return null;
    }

    const dataHash = generateStableHash(dailyData);
    
    const txHash = await recordHashOnBlockchain(userId, dateString, dataHash);

    return await saveLogToDatabase(userId, targetDate, dailyData, dataHash, txHash);
}

async function gatherDailyData(userId: number, dateString: string): Promise<object | null> {
    const user = await User.findByPk(userId);
    const dailyTasks = await taskService.getTasksByDate(userId, dateString);
    const dailyEvents = await eventService.getEventsByDate(userId, dateString);

    if (dailyTasks.length === 0 && dailyEvents.length === 0) {
        return null;
    }

    return {
        userId,
        userEmail: user ? user.email : 'Unknown',
        date: dateString,
        tasks: dailyTasks.map(t => t.toJSON()),
        events: dailyEvents.map(e => (e as any).toJSON ? (e as any).toJSON() : e)
    };
}

async function recordHashOnBlockchain(userId: number, dateString: string, dataHash: string): Promise<string> {
    const userAndDateString = `${userId}_${dateString}`;
    console.log(`Recording hash on blockchain: ${userAndDateString} - Hash: ${dataHash}`);
    
    return await blockchainProvider.saveHashToBlockchain(userAndDateString, dataHash);
}

async function saveLogToDatabase(userId: number, targetDate: Date, dailyData: object, dataHash: string, txHash: string) {
    return await DailyLog.create({
        userId: userId,
        date: targetDate,
        content: JSON.stringify(dailyData),
        hash: dataHash,
        transactionHash: txHash
    });
}

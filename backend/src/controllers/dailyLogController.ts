import { Request, Response } from 'express';
import { DailyLog } from '../models';
import { generateStableHash } from '../utils/cryptoUtils';
import { blockchainProvider } from '../providers/blockchainProvider';
import { sendSuccess, sendError } from '../utils/response';

export const getLogByDate = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = req.user?.id; 
        const { date } = req.params; // YYYY-MM-DD format

        if (!userId) {
            return sendError(res, 'Unauthorized', 401);
        }

        const logEntry = await DailyLog.findOne({
            where: { userId, date }
        });

        if (!logEntry) {
            return sendError(res, 'No log found for the specified date.', 404);
        }

        const originalData = JSON.parse(logEntry.content);
        const userAndDateString = `${userId}_${date}`;
        
        let isVerified = false;
        try {
            const blockchainHash = await blockchainProvider.getHashFromBlockchain(userAndDateString);
            isVerified = (blockchainHash === logEntry.hash) && (blockchainHash !== "");
        } catch (bcError) {
            console.error('Blockchain access error while querying:', bcError);
            return sendSuccess(res, {
                transactionHash: logEntry.transactionHash,
                dailyLog: originalData,
                isVerified: false
            }, 'Data loaded, but the blockchain network is currently unavailable for verification.');
        }

        sendSuccess(res, {
            transactionHash: logEntry.transactionHash,
            dailyLog: originalData,
            isVerified: isVerified
        }, 'Verified daily log retrieved.');

    } catch (error) {
        console.error('Error while fetching daily log:', error);
        sendError(res, 'Internal server error while fetching the log', 500, error);
    }
};

export const verifyUploadedLog = async (req: Request, res: Response): Promise<void> => {
    try {
        const dailyLogData = req.body;

        if (!dailyLogData || !dailyLogData.userId || !dailyLogData.date) {
            return sendError(res, 'Invalid JSON format. Missing userId or date.', 400);
        }

        const { userId, date } = dailyLogData;

        const calculatedHash = generateStableHash(dailyLogData);

        const userAndDateString = `${userId}_${date}`;
        let blockchainHash = "";
        
        try {
            blockchainHash = await blockchainProvider.getHashFromBlockchain(userAndDateString);
        } catch (bcError) {
             console.error('Blockchain access error while verifying:', bcError);
             return sendError(res, 'The blockchain network is currently unavailable for verification.', 503);
        }

        const isVerified = (calculatedHash === blockchainHash) && (blockchainHash !== "");

        if (isVerified) {
            sendSuccess(res, { isVerified: true }, 'The file is authentic! Its content matches the state recorded on the blockchain.');
        } else {
            sendSuccess(res, { isVerified: false }, 'Verification failed! The file content has changed, or it is not recorded.');
        }

    } catch (error) {
        console.error('Error while verifying uploaded log:', error);
        sendError(res, 'Internal server error while verifying the log', 500, error);
    }
};

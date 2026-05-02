import { Request, Response } from 'express';
import { DailyLog } from '../models';
import { generateStableHash } from '../utils/cryptoUtils';
import { blockchainProvider } from '../providers/blockchainProvider';

export const getLogByDate = async (req: Request, res: Response): Promise<void> => {
    try {
        const userId = (req as any).user?.id; 
        const { date } = req.params; // YYYY-MM-DD format

        if (!userId) {
            res.status(401).json({ message: 'Unauthorized' });
            return;
        }

        const logEntry = await DailyLog.findOne({
            where: { userId, date }
        });

        if (!logEntry) {
            res.status(404).json({ message: 'No log found for the specified date.' });
            return;
        }

        const originalData = JSON.parse(logEntry.content);
        const userAndDateString = `${userId}_${date}`;
        
        let isVerified = false;
        try {
            const blockchainHash = await blockchainProvider.getHashFromBlockchain(userAndDateString);
            isVerified = (blockchainHash === logEntry.hash) && (blockchainHash !== "");
        } catch (bcError) {
            console.error('Blockchain access error while querying:', bcError);
            res.status(503).json({ 
                message: 'Data loaded successfully, but the blockchain network is currently unavailable for verification.',
                transactionHash: logEntry.transactionHash,
                dailyLog: originalData,
                isVerified: false
            });
            return;
        }

        res.status(200).json({
            transactionHash: logEntry.transactionHash,
            dailyLog: originalData,
            isVerified: isVerified
        });

    } catch (error) {
        console.error('Error while fetching daily log:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

export const verifyUploadedLog = async (req: Request, res: Response): Promise<void> => {
    try {
        const dailyLogData = req.body;

        if (!dailyLogData || !dailyLogData.userId || !dailyLogData.date) {
            res.status(400).json({ message: 'Invalid JSON format. Missing userId or date.' });
            return;
        }

        const { userId, date } = dailyLogData;

        const calculatedHash = generateStableHash(dailyLogData);

        const userAndDateString = `${userId}_${date}`;
        const blockchainHash = await blockchainProvider.getHashFromBlockchain(userAndDateString);

        const isVerified = (calculatedHash === blockchainHash) && (blockchainHash !== "");

        if (isVerified) {
            res.status(200).json({ 
                isVerified: true, 
                message: 'The file is authentic! Its content matches the state recorded on the blockchain.' 
            });
        } else {
            res.status(200).json({ 
                isVerified: false, 
                message: 'Verification failed! The file content has changed, or it is not recorded.' 
            });
        }

    } catch (error) {
        console.error('Error while verifying uploaded log:', error);
        res.status(500).json({ message: 'Internal server error during verification' });
    }
};

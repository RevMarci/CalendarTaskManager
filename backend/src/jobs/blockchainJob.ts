import cron from 'node-cron';
import { User } from '../models';
import { backupDailyActivity } from '../services/dailyLogService';

export function startBlockchainDailySaveJob(): void {
    // every day at 00:00
    cron.schedule('0 0 * * *', async function() {
        console.log('--- Daily Blockchain Save Job Started ---');
        
        try {
            const targetDate = new Date();
            targetDate.setDate(targetDate.getDate() - 2);
            
            const users = await User.findAll();

            if (!users || users.length === 0) {
                console.log('No users found in the system.');
                return;
            }

            for (const user of users) {
                try {
                    const userId = (user as any).id; 
                    
                    console.log(`Processing user: User ID ${userId}`);
                    await backupDailyActivity(userId, targetDate);
                    
                } catch (userError) {
                    console.error(`Failed to save data for user ${ (user as any).id }:`, userError);
                }
            }

            console.log('--- Daily Blockchain Save Job Completed ---');

        } catch (error) {
            console.error('Critical error in the Daily Blockchain Save Job:', error);
        }
    });
}

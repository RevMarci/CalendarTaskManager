import cron from 'node-cron';
import ExternalCalendar from '../models/ExternalCalendar';
import * as externalCalendarService from '../services/externalCalendarService';

export const initCalendarSyncJob = () => {
    cron.schedule('0 1 * * *', async () => {
        console.log('Starting daily external calendar sync job...');
        
        try {
            const calendars = await ExternalCalendar.findAll();
            
            if (calendars.length === 0) {
                console.log('No external calendars found to sync.');
                return;
            }

            let successCount = 0;
            let failCount = 0;

            for (const calendar of calendars) {
                try {
                    await externalCalendarService.syncCalendar(calendar.id, calendar.userId);
                    successCount++;
                } catch (syncError) {
                    console.error(`[Job] Failed to sync calendar ID: ${calendar.id} (User: ${calendar.userId})`, syncError);
                    failCount++;
                }
            }

            console.log(`Daily sync finished. Successfully synced: ${successCount}, Failed: ${failCount}`);
        } catch (error) {
            console.error('Fatal error during the daily calendar sync job:', error);
        }
    });
};

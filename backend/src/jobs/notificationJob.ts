import cron from 'node-cron';
import { Op } from 'sequelize';
import { Event, User } from '../models';
import { notificationService } from '../services/notification/notificationService';

export const initNotificationJob = () => {
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            
            const startOfMinute = new Date(now);
            startOfMinute.setSeconds(0, 0);

            const endOfMinute = new Date(now);
            endOfMinute.setSeconds(59, 999);

            const events = await Event.findAll({
                where: {
                    start: { [Op.between]: [startOfMinute, endOfMinute] }
                },
                include: [{ 
                    model: User, 
                    as: 'user',
                    attributes: ['id', 'eventNotificationsEnabled', 'eventNotificationType', 'email', 'discordWebhook']
                }]
            });

            if (events.length > 0) {
                console.log(`[NotificationJob] Found ${events.length} events for the time ${now.toLocaleTimeString()}!`);
                
                events.forEach(async event => {
                    console.log(` -> Event ID: ${event.id} | Start: ${event.start}`);
                    
                    await notificationService.handleEventNotification(event);
                });
            } else {
                console.log(`[NotificationJob] No events found for the time ${now.toLocaleTimeString()}!`);
            }

        } catch (error) {
            console.error('[NotificationJob] Error occurred while fetching events:', error);
        }
    });
};

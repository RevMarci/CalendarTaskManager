import cron from 'node-cron';
import { Op } from 'sequelize';
import { Event, Task, TaskGroup, TaskBoard, User } from '../models';
import { notificationService } from '../services/notification/notificationService';

export const initNotificationJob = () => {
    cron.schedule('* * * * *', async () => {
        try {
            const now = new Date();
            
            const startOfMinute = new Date(now);
            startOfMinute.setSeconds(0, 0);

            const endOfMinute = new Date(now);
            endOfMinute.setSeconds(59, 999);

            const [events, tasks] = await Promise.all([
                // 1. Events
                Event.findAll({
                    where: { start: { [Op.between]: [startOfMinute, endOfMinute] } },
                    include: [{ 
                        model: User, 
                        as: 'user',
                        attributes: ['id', 'eventNotificationsEnabled', 'eventNotificationType', 'email', 'discordWebhook']
                    }]
                }),

                // 2. Tasks
                Task.findAll({
                    where: { startTime: { [Op.between]: [startOfMinute, endOfMinute] } },
                    include: [{
                        model: TaskGroup,
                        include: [{
                            model: TaskBoard,
                            include: [{
                                model: User,
                                attributes: ['id', 'eventNotificationsEnabled', 'eventNotificationType', 'email', 'discordWebhook']
                            }]
                        }]
                    }]
                })
            ]);

            console.log(`[NotificationJob] Found ${events.length} events and ${tasks.length} tasks starting ${startOfMinute.toISOString()}.`);

            // Event
            for (const event of events) {
                await notificationService.handleEventNotification(event);
            }

            // Task
            for (const task of tasks) {
                const user = (task as any).TaskGroup?.TaskBoard?.User; 
                
                if (user) {
                    await notificationService.handleTaskNotification(task, user);
                }
            }

        } catch (error) {
            console.error('[NotificationJob] Error occurred while fetching events:', error);
        }
    });
};

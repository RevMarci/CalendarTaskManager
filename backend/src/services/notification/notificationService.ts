import { emailNotificationService } from './emailNotificationService';
import { discordNotificationService } from './discordNotificationService';

class NotificationService {
    public async handleEventNotification(event: any) {
        const user = event.user;
        if (!user) return;

        if (!user.eventNotificationsEnabled) {
            console.log(`[NotificationService] User ${user.email} has event notifications disabled. Skipping.`);
            return;
        }

        console.log(`[NotificationService] Processing event: ${event.title} for user: ${user.email}`);

        if (user.eventNotificationType === 'email' && user.email) {
            await emailNotificationService.sendEventReminder(user, event);
        }

        if (user.eventNotificationType === 'discord' && user.discordWebhook) {
            await discordNotificationService.sendEventReminder(user, event);
        }
    }
}

export const notificationService = new NotificationService();

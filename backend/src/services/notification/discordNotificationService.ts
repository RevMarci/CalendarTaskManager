import { sendDiscordMessage } from '../../providers/discordProvider';

class DiscordNotificationService {
    public async sendEventReminder(user: any, event: any) {
        const message = `
**Notification!**
You have an upcoming event: **${event.title}**
Time: ${new Date(event.start).toLocaleTimeString('hu-HU')}
Description: ${event.description || 'No description provided.'}
        `;

        await sendDiscordMessage(user.discordWebhook, message);
    }
}

export const discordNotificationService = new DiscordNotificationService();
import { discordProvider } from '../../providers/discordProvider';

class DiscordNotificationService {
    public async sendEventReminder(user: any, event: any) {
        const message = `
**Notification!**
You have an upcoming event: **${event.title}**
Time: ${new Date(event.start).toLocaleTimeString('hu-HU')}
Description: ${event.description || 'No description provided.'}
        `;

        await discordProvider.sendDiscordMessage(user.discordWebhook, message);
    }

    public async sendTaskReminder(user: any, task: any) {
        const message = `
**Notification!**
You have an upcoming task: **${task.title}**
Time: ${new Date(task.startTime).toLocaleTimeString('hu-HU')}
Deadline: ${new Date(task.deadLine).toLocaleDateString('hu-HU')}
Duration: ${task.duration} minutes
Description: ${task.description || 'No description provided.'}
        `;

        await discordProvider.sendDiscordMessage(user.discordWebhook, message);
    }
}

export const discordNotificationService = new DiscordNotificationService();

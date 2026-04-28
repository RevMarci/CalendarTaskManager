import { sendEmail } from '../../providers/emailProvider';

class EmailNotificationService {
    public async sendEventReminder(user: any, event: any) {
        const subject = `Event Reminder: ${event.title}`;
        const html = `
            <h3>Event Notification</h3>
            <p>There is an upcoming event:</p>
            <p><strong>${event.title}</strong></p>
            <p>Time: ${new Date(event.start).toLocaleString('hu-HU')}</p>
            <p>Description: ${event.description || 'No description provided.'}</p>
        `;

        await sendEmail(user.email, subject, html);
    }
}

export const emailNotificationService = new EmailNotificationService();
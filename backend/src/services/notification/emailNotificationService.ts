import { emailProviderSMTP } from '../../providers/emailProviderSMTP';
import { emailProviderHTTPs } from '../../providers/emailProviderHTTPs';

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

        await this.sendEmail(user.email, subject, html);
    }

    public async sendTaskReminder(user: any, task: any) {
        const subject = `Task Reminder: ${task.title}`;
        const html = `
            <h3>Task Notification</h3>
            <p>There is an upcoming task:</p>
            <p><strong>${task.title}</strong></p>
            <p>Due Date: ${new Date(task.dueDate).toLocaleString('hu-HU')}</p>
            <p>Description: ${task.description || 'No description provided.'}</p>
        `;
        await this.sendEmail(user.email, subject, html);
    }

    private async sendEmail(to: string, subject: string, htmlContent: string) {
        if (process.env.NODE_ENV === 'development') {
            console.log('Sending email with SMTP (Development mode)...');
            return await emailProviderSMTP.sendEmail(to, subject, htmlContent);
        }
        else {
            console.log('Sending email with HTTPS API (Production mode)...');
            return await emailProviderHTTPs.sendEmail(to, subject, htmlContent);
        }
    }
}

export const emailNotificationService = new EmailNotificationService();

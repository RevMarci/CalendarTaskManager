import nodemailer from 'nodemailer';
import dns from 'dns';

dns.setDefaultResultOrder('ipv4first');

class EmailProvider {
    public async sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: Number(process.env.SMTP_PORT) || 465,
                secure: process.env.SMTP_PORT === '465' || process.env.SMTP_PORT === undefined, 
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASS,
                },
                tls: {
                    rejectUnauthorized: false,
                },
                connectionTimeout: 10000,
            });

            const info = await transporter.sendMail({
                from: `"Calendar Task Manager" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
                to: to,
                subject: subject,
                html: htmlContent,
            });

            console.log(`Email successfully sent to ${to}. Message ID: ${info.messageId}`);
            return true;

        } catch (error) {
            console.error('Error on sending email:', error);
            return false;
        }
    }
}

export const emailProvider = new EmailProvider();

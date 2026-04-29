import { google } from 'googleapis';

const OAuth2 = google.auth.OAuth2;

class EmailProviderHTTPs {
    private oauth2Client;
    private gmail;

    constructor() {
        this.oauth2Client = new OAuth2(
            process.env.GOOGLE_CLIENT_ID,
            process.env.GOOGLE_CLIENT_SECRET,
            "https://developers.google.com/oauthplayground"
        );

        this.oauth2Client.setCredentials({
            refresh_token: process.env.GOOGLE_REFRESH_TOKEN
        });

        this.gmail = google.gmail({ version: 'v1', auth: this.oauth2Client });
    }

    public async sendEmail(to: string, subject: string, htmlContent: string): Promise<boolean> {
        try {
            // Gmail API require raw base64 encoded email message
            const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
            
            const messageParts = [
                `From: Calendar Task Manager <${process.env.SMTP_USER}>`,
                `To: ${to}`,
                'Content-Type: text/html; charset=utf-8',
                'MIME-Version: 1.0',
                `Subject: ${utf8Subject}`,
                '',
                htmlContent,
            ];

            const message = messageParts.join('\n');
            
            const encodedMessage = Buffer.from(message)
                .toString('base64')
                .replace(/\+/g, '-')
                .replace(/\//g, '_')
                .replace(/=+$/, '');

            const info = await this.gmail.users.messages.send({
                userId: 'me', // authenticated user on behalf of whom the email will be sent
                requestBody: {
                    raw: encodedMessage,
                },
            });

            console.log(`Email successfully sent to ${to}. Message ID: ${info.data.id}`);
            return true;

        } catch (error) {
            console.error('Error on sending email via Gmail API:', error);
            return false;
        }
    }
}

export const emailProviderHTTPs = new EmailProviderHTTPs();

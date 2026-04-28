import axios from 'axios';

class DiscordProvider {
    public async sendDiscordMessage(webhookUrl: string, message: string): Promise<boolean> {
        try {
            const response = await axios.post(
                webhookUrl,
                {
                    content: message,
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                }
            );

            console.log(`Message successfully sent to Discord webhook. Status: ${response.status}`);
            return true;

        } catch (error) {
            console.error('Error on sending discord message:', error);
            return false;
        }
    }
}

export const discordProvider = new DiscordProvider();

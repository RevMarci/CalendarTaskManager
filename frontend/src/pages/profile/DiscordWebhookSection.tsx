import { useState } from 'react';
import { userService } from '../../services/userService';
import TextInput from '../../components/inputs/TextInput';
import SaveButton from '../../components/buttons/SaveButton';

interface DiscordWebhookSectionProps {
    initialWebhook: string;
    onUpdate: (newWebhook: string) => void;
}

export default function DiscordWebhookSection({ initialWebhook, onUpdate }: DiscordWebhookSectionProps) {
    const [discordWebhook, setDiscordWebhook] = useState(initialWebhook);
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        try {
            setIsSaving(true);
            await userService.updateProfile({ discordWebhook });
            
            setMessage({ type: 'success', text: 'Discord webhook saved successfully!' });
            onUpdate(discordWebhook);
        } catch (err: any) {
            setMessage({ 
                type: 'error', 
                text: err.message || 'Failed to save Discord webhook.' 
            });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">
                Discord Integration
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <TextInput 
                    label="Discord Webhook URL - Fill in if you want to receive notifications in a Discord channel."
                    type="url" 
                    value={discordWebhook}
                    onChange={(e) => setDiscordWebhook(e.target.value)}
                    placeholder="https://discord.com/api/webhooks/..."
                />

                {message && (
                    <div className={`p-3 rounded text-sm ${
                        message.type === 'success' 
                            ? 'bg-green-900/20 text-green-400 border border-green-800' 
                            : 'bg-red-900/20 text-red-400 border border-red-800'
                    }`}>
                        {message.text}
                    </div>
                )}

                <div className="pt-2">
                    <SaveButton type="submit" disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Webhook'}
                    </SaveButton>
                </div>
            </form>
        </div>
    );
}

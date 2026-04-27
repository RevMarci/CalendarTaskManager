import { useState } from 'react';
import { userService, type UserProfile } from '../../services/userService';
import SaveButton from '../../components/buttons/SaveButton';
import Checkbox from '../../components/inputs/Checkbox';
import Radio from '../../components/inputs/Radio';

interface Props {
    profile: UserProfile;
    onUpdate: (updatedFields: Partial<UserProfile>) => void;
}

export default function NotificationSettingsSection({ profile, onUpdate }: Props) {
    const [settings, setSettings] = useState({
        eventNotificationsEnabled: profile.eventNotificationsEnabled,
        eventNotificationType: profile.eventNotificationType,
        dailySummaryEnabled: profile.dailySummaryEnabled,
        dailySummaryType: profile.dailySummaryType,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        setIsSaving(true);

        try {
            await userService.updateProfile(settings);
            setMessage({ type: 'success', text: 'Notification settings updated!' });
            onUpdate(settings);
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message || 'Failed to save settings.' });
        } finally {
            setIsSaving(false);
        }
    };

    const renderTypeSelector = (prefix: 'event' | 'daily') => {
        const isEnabled = prefix === 'event' ? settings.eventNotificationsEnabled : settings.dailySummaryEnabled;
        const currentType = prefix === 'event' ? settings.eventNotificationType : settings.dailySummaryType;
        const typeKey = prefix === 'event' ? 'eventNotificationType' : 'dailySummaryType';

        if (!isEnabled) return null;

        const isDiscordSelectedWithoutWebhook = currentType === 'discord' && !profile.discordWebhook;

        return (
            <div className="mt-3 ml-8">
                <div className="flex gap-6">
                    <Radio 
                        label="Email"
                        checked={currentType === 'email'}
                        onChange={() => setSettings({ ...settings, [typeKey]: 'email' })}
                    />
                    <Radio 
                        label="Discord"
                        checked={currentType === 'discord'}
                        onChange={() => setSettings({ ...settings, [typeKey]: 'discord' })}
                    />
                </div>
                
                {isDiscordSelectedWithoutWebhook && (
                    <div className="text-yellow-500 text-xs mt-2.5 flex items-center gap-1.5 bg-yellow-900/10 p-2 rounded border border-yellow-900/30 w-fit">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 shrink-0">
                            <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                        <span>Discord webhook is missing! Please configure it in the section above.</span>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Notification Settings</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <Checkbox 
                        label="Enable event notifications"
                        checked={settings.eventNotificationsEnabled}
                        onChange={(val) => setSettings({ ...settings, eventNotificationsEnabled: val })}
                    />
                    {renderTypeSelector('event')}
                </div>

                <div>
                    <Checkbox 
                        label="Enable daily summary (every morning)"
                        checked={settings.dailySummaryEnabled}
                        onChange={(val) => setSettings({ ...settings, dailySummaryEnabled: val })}
                    />
                    {renderTypeSelector('daily')}
                </div>

                {message && (
                    <div className={`p-3 rounded text-sm ${message.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-800' : 'bg-red-900/20 text-red-400 border border-red-800'}`}>
                        {message.text}
                    </div>
                )}

                <SaveButton type="submit" disabled={isSaving}>
                    {isSaving ? 'Saving...' : 'Save Notification Settings'}
                </SaveButton>
            </form>
        </div>
    );
}

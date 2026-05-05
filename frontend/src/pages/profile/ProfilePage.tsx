import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, type UserProfile } from '../../services/userService';
import { authService } from '../../services/authService';
import DeleteButton from '../../components/buttons/DeleteButton';
import GoogleAuthButton from '../../components/buttons/GoogleAuthButton';
import SaveButton from '../../components/buttons/SaveButton';
import TextInput from '../../components/inputs/TextInput';
import Divider from '../../components/Divider';
import DiscordWebhookSection from './DiscordWebhookSection';
import NotificationSettingsSection from './NotificationSettingsSection';
import ExternalCalendarsSection from './ExternalCalendarsSection';

export default function ProfilePage() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userService.getProfile();
                setProfile(data);
            } catch (err) {
                console.error("Error loading profile:", err);
                setError("Failed to load profile data.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setPasswordMessage(null);

        if (newPassword !== confirmPassword) {
            setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
            return;
        }

        try {
            setIsSaving(true);
            await userService.changePassword({
                oldPassword: profile?.hasPassword ? oldPassword : undefined,
                newPassword,
                confirmPassword
            });
            
            setPasswordMessage({ 
                type: 'success', 
                text: profile?.hasPassword ? 'Password updated successfully!' : 'Password created successfully!' 
            });
            
            setOldPassword('');
            setNewPassword('');
            setConfirmPassword('');
            
            if (profile && !profile.hasPassword) {
                setProfile({ ...profile, hasPassword: true });
            }
        } catch (err: any) {
            setPasswordMessage({ 
                type: 'error', 
                text: err.message || 'Failed to save password.' 
            });
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) return <div className="p-6 text-gray-400">Loading profile...</div>;
    if (error) return <div className="p-6 text-red-400">Error: {error}</div>;
    if (!profile) return null;

    return (
        <div className="max-w-full mx-auto p-0">
            <div>
                <h1 className="text-3xl font-bold text-white">Profile</h1>
                <p className="text-gray-400 mt-1">View and manage your account details</p>
            </div>

            <Divider />
            
            <div className="max-w-xl pb-8">
                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                        Email Address
                    </label>
                    <div className="text-xl text-gray-200 font-semibold">
                        {profile.email}
                    </div>

                    {profile.hasGoogleId ? (
                        <div className="flex items-center text-green-400 mt-4">
                            <span className="mr-2">●</span>
                            <span className="text-gray-300">Google account connected</span>
                        </div>
                    ) : (
                        <div>
                            <p className="text-sm text-gray-400 mb-4 mt-6">
                                Connect your Google account to enable one-click login.
                            </p>
                            <GoogleAuthButton text='signin' alignment="justify-start"/>
                        </div>
                    )}
                </div>

                <Divider />

                <DiscordWebhookSection 
                    initialWebhook={profile.discordWebhook || ''} 
                    onUpdate={(val) => setProfile({ ...profile, discordWebhook: val })}
                />

                <Divider />

                <NotificationSettingsSection 
                    profile={profile} 
                    onUpdate={(updates) => setProfile({ ...profile, ...updates })}
                />

                <Divider />

                <ExternalCalendarsSection />

                <Divider />

                <div>
                    <h2 className="text-xl font-semibold text-white mb-4">
                        {profile.hasPassword ? 'Change Password' : 'Set Password'}
                    </h2>
                    
                    <form onSubmit={handlePasswordSubmit} className="space-y-4">
                        {profile.hasPassword && (
                            <TextInput 
                                label="Current Password"
                                type="password" 
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                required 
                            />
                        )}
                        
                        <TextInput 
                            label="New Password"
                            type="password" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required 
                        />

                        <TextInput 
                            label="Confirm New Password"
                            type="password" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required 
                        />

                        {passwordMessage && (
                            <div className={`p-3 rounded text-sm ${passwordMessage.type === 'success' ? 'bg-green-900/20 text-green-400 border border-green-800' : 'bg-red-900/20 text-red-400 border border-red-800'}`}>
                                {passwordMessage.text}
                            </div>
                        )}

                        <div className="pt-2">
                            <SaveButton type="submit" disabled={isSaving}>
                                {isSaving ? 'Saving...' : (profile.hasPassword ? 'Update Password' : 'Set Password')}
                            </SaveButton>
                        </div>
                    </form>
                </div>

                <Divider />

                <div>
                    <DeleteButton onClick={handleLogout}>
                        Log Out
                    </DeleteButton>
                </div>
            </div>
        </div>
    );
}

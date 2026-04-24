import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService, type UserProfile } from '../../services/userService';
import { authService } from '../../services/authService';
import DeleteButton from '../../components/buttons/DeleteButton';
import GoogleAuthButton from '../../components/buttons/GoogleAuthButton';

export default function ProfilePage() {
    const navigate = useNavigate();

    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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

    if (isLoading) return <div className="p-6 text-gray-400">Loading profile...</div>;
    if (error) return <div className="p-6 text-red-400">Error: {error}</div>;
    if (!profile) return null;

    return (
        <div className="max-w-full mx-auto p-0">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white">Profile</h1>
                <p className="text-gray-400 mt-1">View your account details</p>
            </div>
            
            <div className="max-w-xl">
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
                            <GoogleAuthButton text='signin'/>
                        </div>
                    )}
                </div>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-800">
                <DeleteButton onClick={handleLogout}>
                    Log Out
                </DeleteButton>
            </div>
        </div>
    );
}

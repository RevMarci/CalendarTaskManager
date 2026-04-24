import { useEffect, useState } from 'react';
import { userService, type UserProfile } from '../../services/userService';

export default function ProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                        Username
                    </label>
                    <div className="text-xl text-gray-200 font-semibold">
                        {profile.username}
                    </div>
                </div>

                <div className="mb-8">
                    <label className="block text-sm font-medium text-gray-500 mb-1">
                        Email Address
                    </label>
                    <div className="text-xl text-gray-200 font-semibold">
                        {profile.email || <span className="text-gray-600 italic font-normal">No email provided</span>}
                    </div>
                </div>
            </div>
        </div>
    );
}

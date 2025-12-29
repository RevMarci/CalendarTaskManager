import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import TextInput from '../../components/inputs/TextInput';
import SaveButton from '../../components/buttons/SaveButton';

export default function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('The passwords do not match');
            return;
        }

        try {
            await authService.register({ username, password });
            navigate('/task');
        } catch (err: any) {
            setError(err.message || 'Error during registration');
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center h-full max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-white">Registration</h1>
            
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <TextInput
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                
                <TextInput
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <TextInput
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error && (
                    <div className="text-red-500 text-sm mt-2 text-center">
                        {error}
                    </div>
                )}

                <div className="mt-4 flex flex-col gap-4">
                    <div className="flex justify-center">
                        <SaveButton type="submit">
                            Registration
                        </SaveButton>
                    </div>
                    
                    <div className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link to="/login" className="text-blue-400 hover:text-blue-300">
                            Login
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
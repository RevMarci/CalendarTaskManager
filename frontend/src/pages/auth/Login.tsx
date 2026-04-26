import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/authService';
import TextInput from '../../components/inputs/TextInput';
import SaveButton from '../../components/buttons/SaveButton';
import Divider from '../../components/Divider';
import GoogleAuthButton from '../../components/buttons/GoogleAuthButton';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            await authService.login({ email, password });
            navigate('/task');
        } catch (err: any) {
            setError(err.message || 'Error during login');
        }
    };

    return (
        <div className="w-full flex flex-col items-center justify-center h-full max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-white">Login</h1>
            
            <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
                <TextInput
                    label="Email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                
                <TextInput
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && (
                    <div className="text-red-500 text-sm mt-2 text-center">
                        {error}
                    </div>
                )}

                <div className="mt-4 flex flex-col gap-4">
                    <div className="flex justify-center">
                        <SaveButton type="submit">
                        Login
                        </SaveButton>
                    </div>

                    <Divider label="Or" align="center" className="my-4" />
                    
                    <GoogleAuthButton 
                        onError={(msg) => setError(msg)} 
                    />

                    <div className="text-center text-sm text-gray-500">
                        Don't have an account yet?{' '}
                        <Link to="/register" className="text-blue-400 hover:text-blue-300">
                            Register
                        </Link>
                    </div>
                </div>
            </form>
        </div>
    );
}
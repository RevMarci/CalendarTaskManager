import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

interface GoogleAuthButtonProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
    text?: "signin_with" | "signup_with" | "continue_with" | "signin";
    locale?: string;
}

export default function GoogleAuthButton({ 
    onSuccess, 
    onError, 
    text = "signin_with", 
}: GoogleAuthButtonProps) {
    const navigate = useNavigate();

    const handleSuccess = async (credentialResponse: any) => {
        try {
            if (credentialResponse.credential) {
                await authService.loginWithGoogle(credentialResponse.credential);
                
                if (onSuccess) {
                    onSuccess();
                } else {
                    navigate('/task');
                }
            }
        } catch (err: any) {
            const errorMessage = err.message || 'Error during Google login';
            if (onError) {
                onError(errorMessage);
            }
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => onError?.('Error during Google login')}
            theme="outline"
            text={text}
            width="100%"
        />
    );
}

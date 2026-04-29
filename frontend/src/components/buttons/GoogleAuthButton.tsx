import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

interface GoogleAuthButtonProps {
    onSuccess?: () => void;
    onError?: (error: string) => void;
    text?: "signin_with" | "signup_with" | "continue_with" | "signin";
    locale?: string;
    alignment?: "justify-center" | "justify-start";
}

export default function GoogleAuthButton({ 
    onSuccess, 
    onError, 
    text = "signin_with", 
    alignment = "justify-center",
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
        <div className={`w-full flex ${alignment}`}>
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => onError?.('Error during Google login')}
                theme="outline"
                text={text}
            />
        </div>
    );
}

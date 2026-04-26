import { apiClient } from "../api/apiClient";

interface LoginCredentials {
    email: string;
    password?: string;
}

interface AuthData {
    id: number;
    email: string;
    token: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const authService = {
    login: async (credentials: LoginCredentials) => {
        const response = await apiClient<ApiResponse<AuthData>>('/auth/login', {
            method: 'POST',
            body: credentials
        });
        
        const authData = response.data;

        if (authData?.token) {
            localStorage.setItem('token', authData.token);
            localStorage.setItem('user', JSON.stringify({ id: authData.id, email: authData.email }));
        }
        
        return authData;
    },

    register: async (credentials: LoginCredentials) => {
        const response = await apiClient<ApiResponse<AuthData>>('/auth/register', {
            method: 'POST',
            body: credentials
        });

        const authData = response.data;

        if (authData?.token) {
            localStorage.setItem('token', authData.token);
            localStorage.setItem('user', JSON.stringify({ id: authData.id, email: authData.email }));
        }

        return authData;
    },

    loginWithGoogle: async (credential: string) => {
        const response = await apiClient<ApiResponse<AuthData>>('/auth/google', {
            method: 'POST',
            body: { credential }
        });
        
        const authData = response.data;

        if (authData?.token) {
            localStorage.setItem('token', authData.token);
            localStorage.setItem('user', JSON.stringify({ id: authData.id, email: authData.email }));
        }
        
        return authData;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }
};
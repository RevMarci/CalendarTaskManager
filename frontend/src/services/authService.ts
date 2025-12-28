import { apiClient } from "../api/apiClient";

interface LoginCredentials {
    username: string;
    password?: string;
}

interface AuthData {
    id: number;
    username: string;
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
            localStorage.setItem('user', JSON.stringify({ id: authData.id, username: authData.username }));
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
            localStorage.setItem('user', JSON.stringify({ id: authData.id, username: authData.username }));
        }

        return authData;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    }
};
import { apiClient } from "../api/apiClient";

interface LoginCredentials {
    username: string;
    password?: string;
}

interface AuthResponse {
    id: number;
    username: string;
    token: string;
}

export const authService = {
    login: async (credentials: LoginCredentials) => {
        const response = await apiClient<AuthResponse>('/auth/login', {
            method: 'POST',
            body: credentials
        });
        
        if (response?.token) {
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify({ id: response.id, username: response.username }));
        }
        
        return response;
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
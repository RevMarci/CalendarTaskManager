import { apiClient } from "../api/apiClient";

export interface UserProfile {
    id: number;
    email: string;
    hasGoogleId: boolean;
    hasPassword: boolean; 
}

export interface ChangePasswordData {
    oldPassword?: string;
    newPassword: string;
    confirmPassword: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const userService = {
    getProfile: async (): Promise<UserProfile> => {
        const response = await apiClient<ApiResponse<UserProfile>>('/users/profile', {
            method: 'GET'
        });
        
        return response.data;
    },

    changePassword: async (data: ChangePasswordData): Promise<void> => {
        await apiClient<ApiResponse<null>>('/users/password', {
            method: 'PATCH',
            body: data
        });
    }
};

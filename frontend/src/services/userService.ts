import { apiClient } from "../api/apiClient";

export interface UserProfile {
    id: number;
    email: string;
    hasGoogleId: boolean;
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
    }
};

import { apiClient } from "../api/apiClient";

export interface DailyLogData {
    transactionHash?: string;
    dailyLog?: any; 
    isVerified: boolean;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const dailyLogService = {
    getLogByDate: async (date: string) => {
        const response = await apiClient<ApiResponse<DailyLogData>>(`/daily-logs/date/${date}`);
        return response.data;
    },

    verifyUploadedLog: async (jsonData: any) => {
        const response = await apiClient<ApiResponse<{ isVerified: boolean }>>('/daily-logs/verify', {
            method: 'POST',
            body: jsonData
        });
        return response.data;
    }
};

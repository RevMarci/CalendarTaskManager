import { apiClient } from "../api/apiClient";

export interface ExternalCalendar {
    id: number;
    name: string;
    url: string;
    color?: string;
    lastSyncedAt?: string;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const externalCalendarService = {
    getAll: async (): Promise<ExternalCalendar[]> => {
        const response = await apiClient<ApiResponse<ExternalCalendar[]>>('/external-calendars');
        return response.data;
    },

    create: async (data: { name: string; url: string; color?: string }): Promise<ExternalCalendar> => {
        const response = await apiClient<ApiResponse<ExternalCalendar>>('/external-calendars', {
            method: 'POST',
            body: data
        });
        return response.data;
    },

    delete: async (id: number | string): Promise<void> => {
        await apiClient<void>(`/external-calendars/${id}`, {
            method: 'DELETE'
        });
    }
};

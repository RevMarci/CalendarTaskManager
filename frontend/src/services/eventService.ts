import { apiClient } from "../api/apiClient";

export interface CalendarEvent {
    id: string; 
    title: string;
    description?: string;
    start: string; 
    end: string;   
    allDay?: boolean;
}

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const eventService = {
    getAll: async () => {
        const response = await apiClient<ApiResponse<any[]>>('/events');
        
        return response.data.map(event => ({
            ...event,
            id: String(event.id)
        })) as CalendarEvent[];
    },

    create: async (eventData: Partial<CalendarEvent>) => {
        const response = await apiClient<ApiResponse<any>>('/events', {
            method: 'POST',
            body: eventData
        });
        return { ...response.data, id: String(response.data.id) } as CalendarEvent;
    },

    update: async (id: string, eventData: Partial<CalendarEvent>) => {
        const response = await apiClient<ApiResponse<any>>(`/events/${id}`, {
            method: 'PUT',
            body: eventData
        });
        return { ...response.data, id: String(response.data.id) } as CalendarEvent;
    },

    delete: async (id: string) => {
        return await apiClient<void>(`/events/${id}`, {
            method: 'DELETE'
        });
    }
};
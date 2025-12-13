import { apiClient } from "../api/apiClient";
import type { Task } from "../models/Task";

interface ApiResponse<T> {
    message: string;
    data: T;
}

export const taskService = {
    getAll: async () => {
        return await apiClient<Task[]>('/tasks');
    },

    create: async (taskData: Partial<Task>) => {
        const response = await apiClient<ApiResponse<Task>>('/tasks', {
            method: 'POST',
            body: { 
                ...taskData,
                status: 'pending' 
            }
        });
        return response.data; 
    },

    update: async (id: number, taskData: Partial<Task>) => {
        const response = await apiClient<ApiResponse<Task>>(`/tasks/${id}`, {
            method: 'PUT',
            body: taskData
        });
        return response.data; 
    },

    delete: async (id: number) => {
        return await apiClient<void>(`/tasks/${id}`, {
            method: 'DELETE'
        });
    }
};
import { apiClient } from "../api/apiClient";
import type { TaskBoard } from "../models/TaskBoard";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const boardService = {
    getAll: async () => {
        const response = await apiClient<ApiResponse<TaskBoard[]>>('/task-boards');
        return response.data;
    },

    getById: async (id: number) => {
        const response = await apiClient<ApiResponse<TaskBoard>>(`/task-boards/${id}`);
        return response.data;
    },

    create: async (boardData: { title: string }) => {
        const response = await apiClient<ApiResponse<TaskBoard>>('/task-boards', {
            method: 'POST',
            body: boardData
        });
        return response.data; 
    },

    update: async (id: number, boardData: Partial<TaskBoard>) => {
        const response = await apiClient<ApiResponse<TaskBoard>>(`/task-boards/${id}`, {
            method: 'PUT',
            body: boardData
        });
        return response.data; 
    },

    delete: async (id: number) => {
        return await apiClient<void>(`/task-boards/${id}`, {
            method: 'DELETE'
        });
    }
};
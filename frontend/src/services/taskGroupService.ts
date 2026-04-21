import { apiClient } from "../api/apiClient";
import type { TaskGroup } from "../models/TaskGroup";

interface ApiResponse<T> {
    success: boolean;
    message: string;
    data: T;
}

export const taskGroupService = {
    create: async (data: { title: string; taskBoardId: number }) => {
        const response = await apiClient<ApiResponse<TaskGroup>>('/task-groups', {
            method: 'POST',
            body: data
        });
        return response.data;
    },

    update: async (id: number, data: { title?: string; position?: number }) => {
        const response = await apiClient<ApiResponse<TaskGroup>>(`/task-groups/${id}`, {
            method: 'PUT',
            body: data
        });
        return response.data;
    }
};
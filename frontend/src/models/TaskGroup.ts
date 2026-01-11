import type { Task } from './Task';

export interface TaskGroup {
    id: number;
    title: string;
    taskBoardId: number;
    createdAt?: string;
    updatedAt?: string;
    Tasks?: Task[];
}
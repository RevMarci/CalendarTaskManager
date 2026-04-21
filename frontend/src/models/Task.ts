import type { TaskStatus } from "./TaskStatus";

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    taskGroupId: number;
    position?: number;
    deadLine?: string;
    duration?: number; // in minutes
    startTime?: string;
}
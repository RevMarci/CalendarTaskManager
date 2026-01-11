import type { TaskStatus } from "./TaskStatus";

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    taskGroupId: Number;
    deadLine?: string;
    duration?: number; // in minutes
    startTime?: string;
}
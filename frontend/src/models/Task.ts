import type { TaskStatus } from "./TaskStatus";

export interface Task {
    id: number;
    title: string;
    description?: string;
    status: TaskStatus;
    deadline?: string;
}
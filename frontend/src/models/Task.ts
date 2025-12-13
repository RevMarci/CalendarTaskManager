import type { TaskStatus } from "./TaskStatus";

export interface Task {
    id: number;
    name: string;
    description?: string;
    status: TaskStatus;
    deadline?: string;
}
import type { TaskGroup } from './TaskGroup';

export interface TaskBoard {
    id: number;
    title: string;
    userId: number;
    createdAt?: string;
    updatedAt?: string;
    TaskGroups?: TaskGroup[];
}
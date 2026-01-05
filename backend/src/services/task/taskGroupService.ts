import TaskGroup from '../../models/task/TaskGroup';
import TaskBoard from '../../models/task/TaskBoard';

interface CreateTaskGroupData {
    title: string;
    taskBoardId: number;
}

export async function getTaskGroups (taskBoardId: number, userId: number): Promise<TaskGroup[]> {
    const board = await TaskBoard.findOne({ 
        where: { id: taskBoardId, userId } 
    });

    if (!board) {
        throw new Error('Task board not found or unauthorized');
    }

    return await TaskGroup.findAll({
        where: { taskBoardId },
    });
};

export async function getTaskGroupById (id: number, userId: number): Promise<TaskGroup | null> {
    const group = await TaskGroup.findOne({
        where: { id },
        include: [{
            model: TaskBoard,
            where: { userId },
            attributes: ['id', 'userId']
        }]
    });

    return group;
};

export async function createTaskGroup (data: CreateTaskGroupData, userId: number): Promise<TaskGroup> {
    const board = await TaskBoard.findOne({ 
        where: { id: data.taskBoardId, userId } 
    });

    if (!board) {
        throw new Error('Task board not found or unauthorized');
    }

    return await TaskGroup.create({
        title: data.title,
        taskBoardId: data.taskBoardId,
    });
};

export async function updateTaskGroup (id: number, userId: number, data: Partial<TaskGroup>): Promise<TaskGroup> {
    const group = await TaskGroup.findOne({
        where: { id },
        include: [{
            model: TaskBoard,
            where: { userId },
            attributes: ['id']
        }]
    });

    if (!group) {
        throw new Error('Task group not found or unauthorized');
    }

    return await group.update(data);
};

export async function deleteTaskGroup (id: number, userId: number): Promise<void> {
    const group = await TaskGroup.findOne({
        where: { id },
        include: [{
            model: TaskBoard,
            where: { userId },
            attributes: ['id']
        }]
    });

    if (!group) {
        throw new Error('Task group not found or unauthorized');
    }

    return await group.destroy();
};
import TaskGroup from '../../models/task/TaskGroup';
import TaskBoard from '../../models/task/TaskBoard';

interface CreateTaskGroupData {
    title: string;
    taskBoardId: number;
}

export const getTaskGroups = async (taskBoardId: number, userId: number) => {
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

export const getTaskGroupById = async (id: number, userId: number) => {
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

export const createTaskGroup = async (data: CreateTaskGroupData, userId: number) => {
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

export const updateTaskGroup = async (id: number, userId: number, data: Partial<TaskGroup>) => {
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

export const deleteTaskGroup = async (id: number, userId: number) => {
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
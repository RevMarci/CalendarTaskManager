import TaskBoard from '../../models/task/TaskBoard';
import TaskGroup from '../../models/task/TaskGroup';
import Task from '../../models/task/Task';

export const createTaskBoard = async (data: { title: string }, userId: number) => {
    return await TaskBoard.create({
        ...data,
        userId,
    });
};

export const getAllTaskBoards = async (userId: number) => {
    return await TaskBoard.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
    });
};

export const getTaskBoardById = async (id: number, userId: number) => {
    return await TaskBoard.findOne({
        where: { id, userId },
        include: [
            {
                model: TaskGroup,
                required: false,
                include: [
                    {
                        model: Task,
                        required: false,
                    }
                ]
            },
        ],
    });
};

export const updateTaskBoard = async (id: number, userId: number, data: Partial<TaskBoard>) => {
    const board = await TaskBoard.findOne({ where: { id, userId } });

    if (!board) {
        throw new Error('Task board not found or unauthorized');
    }

    return await board.update(data);
};

export const deleteTaskBoard = async (id: number, userId: number) => {
    const board = await TaskBoard.findOne({ where: { id, userId } });

    if (!board) {
        throw new Error('Task board not found or unauthorized');
    }

    return await board.destroy();
};
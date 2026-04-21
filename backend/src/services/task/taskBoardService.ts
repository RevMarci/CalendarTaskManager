import TaskBoard from '../../models/task/TaskBoard';
import TaskGroup from '../../models/task/TaskGroup';
import Task from '../../models/task/Task';

export async function createTaskBoard (data: { title: string }, userId: number): Promise<TaskBoard> {
    return await TaskBoard.create({
        ...data,
        userId,
    });
};

export async function getAllTaskBoards (userId: number): Promise<TaskBoard[]> {
    return await TaskBoard.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']],
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

export async function getTaskBoardById (id: number, userId: number): Promise<TaskBoard | null> {
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

export async function updateTaskBoard (id: number, userId: number, data: Partial<TaskBoard>): Promise<TaskBoard> {
    const board = await TaskBoard.findOne({ where: { id, userId } });

    if (!board) {
        throw new Error('Task board not found or unauthorized');
    }

    return await board.update(data);
};

export async function deleteTaskBoard (id: number, userId: number): Promise<void> {
    const board = await TaskBoard.findOne({ where: { id, userId } });

    if (!board) {
        throw new Error('Task board not found or unauthorized');
    }

    return await board.destroy();
};
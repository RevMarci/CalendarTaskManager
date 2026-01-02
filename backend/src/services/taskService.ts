import { Task } from '../models';

export const getAllTasks = async (userId: number) => {
    return await Task.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
    });
};

export const getTaskById = async (id: string, userId: number) => {
    return await Task.findOne({
        where: { id, userId }
    });
};

export const createTask = async (data: {
    title: string;
    description?: string;
    status?: 'pending' | 'completed';
    deadLine?: Date;
    duration?: number;
    startTime?: Date
}, userId: number) => {
    return await Task.create({
        ...data,
        userId
    });
};

export const deleteTask = async (id: string, userId: number) => {
    const task = await Task.findOne({ where: { id, userId } });
    if (!task) return null;
    
    await task.destroy();
    return true;
};

export const updateTask = async (id: string, userId: number, data: any) => {
    const task = await Task.findOne({ where: { id, userId } });
    if (!task) return null;

    return await task.update(data);
};
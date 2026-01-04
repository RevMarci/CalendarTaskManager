import { Task } from '../models';
import { schedulerService } from './schedulerService';

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
    
    let finalStartTime = data.startTime;

    const shouldSchedule = schedulerService.shouldSchedule(
        data.deadLine,
        data.startTime,
        data.status
    );

    if (shouldSchedule) {
        const duration = data.duration || 60;
        
        const foundSlot = await schedulerService.findNextAvailableSlot(
            userId, 
            duration, 
            new Date(data.deadLine!)
        );
        
        if (foundSlot) {
            finalStartTime = foundSlot;
        } else {
            console.log(`Scheduler: No slot found for task "${data.title}" before ${data.deadLine}`);
        }
    }

    return await Task.create({
        ...data,
        startTime: finalStartTime,
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

    const mergedData = {
        ...task.toJSON(),
        ...data,
    };

    const shouldSchedule = schedulerService.shouldSchedule(
        mergedData.deadLine,
        mergedData.startTime,
        mergedData.status
    );

    if (shouldSchedule) {
        const duration = mergedData.duration ?? 60;

        const foundSlot = await schedulerService.findNextAvailableSlot(
            userId,
            duration,
            new Date(mergedData.deadLine!)
        );

        if (foundSlot) {
            mergedData.startTime = foundSlot;
        } else {
            // TODO: No slot found handling
            console.log(`Scheduler: No slot found for updated task "${mergedData.title}" before ${mergedData.deadLine}`);
        }
    }

    return await task.update(mergedData);
};

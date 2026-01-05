import Task from '../../models/task/Task';
import TaskGroup from '../../models/task/TaskGroup';
import TaskBoard from '../../models/task/TaskBoard';
import { schedulerService } from '../schedulerService';

export async function getAllTasks (userId: number): Promise<Task[]> {
    return await Task.findAll({
        include: [{
            model: TaskGroup,
            required: true,
            include: [{
                model: TaskBoard,
                required: true,
                where: { userId }
            }]
        }],
        order: [['createdAt', 'DESC']]
    });
};

export async function getTaskById (id: number, userId: number): Promise<Task | null> {
    return await Task.findOne({
        where: { id },
        include: [{
            model: TaskGroup,
            required: true,
            include: [{
                model: TaskBoard,
                required: true,
                where: { userId }
            }]
        }]
    });
};

export async function createTask (data: {
    title: string;
    description?: string;
    status?: 'pending' | 'completed';
    taskGroupId: number;
    deadLine?: Date;
    duration?: number;
    startTime?: Date
}, userId: number): Promise<Task> {
    
    const group = await TaskGroup.findOne({
        where: { id: data.taskGroupId },
        include: [{
            model: TaskBoard,
            where: { userId },
            required: true
        }]
    });

    if (!group) {
        throw new Error('Task group not found or unauthorized');
    }

    let finalStartTime = data.startTime;

    const shouldSchedule = schedulerService.shouldSchedule(
        data.deadLine,
        data.startTime,
        data.duration,
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
        title: data.title,
        description: data.description,
        status: data.status || 'pending',
        taskGroupId: data.taskGroupId,
        deadLine: data.deadLine,
        duration: data.duration,
        startTime: finalStartTime,
        position: 0
    });
};

export async function deleteTask (id: number, userId: number): Promise<boolean | null> {
    const task = await Task.findOne({
        where: { id },
        include: [{
            model: TaskGroup,
            required: true,
            include: [{
                model: TaskBoard,
                required: true,
                where: { userId }
            }]
        }]
    });

    if (!task) return null;
    
    await task.destroy();
    return true;
};

export async function updateTask (id: number, userId: number, data: any): Promise<Task | null> {
    const task = await Task.findOne({
        where: { id },
        include: [{
            model: TaskGroup,
            required: true,
            include: [{
                model: TaskBoard,
                required: true,
                where: { userId }
            }]
        }]
    });

    if (!task) return null;

    if (data.taskGroupId && data.taskGroupId !== task.taskGroupId) {
        const targetGroup = await TaskGroup.findOne({
            where: { id: data.taskGroupId },
            include: [{
                model: TaskBoard,
                where: { userId },
                required: true
            }]
        });
        if (!targetGroup) {
             throw new Error('Target task group not found or unauthorized');
        }
    }

    const mergedData = {
        ...task.toJSON(),
        ...data,
    };

    const shouldSchedule = schedulerService.shouldSchedule(
        mergedData.deadLine,
        mergedData.startTime,
        mergedData.duration,
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
        }
    }

    return await task.update({
        title: mergedData.title,
        description: mergedData.description,
        status: mergedData.status,
        taskGroupId: mergedData.taskGroupId,
        deadLine: mergedData.deadLine,
        duration: mergedData.duration,
        startTime: mergedData.startTime,
        position: mergedData.position
    });
};
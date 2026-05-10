import cron from 'node-cron';
import { Op } from 'sequelize';
import { Task, TaskGroup, TaskBoard } from '../models';
import { schedulerService } from '../services/schedulerService';

export const initRescheduleJob = () => {
    cron.schedule('0 0 * * *', async () => {
        console.log('[RescheduleJob] Task reschedule job started...');
        
        try {
            const now = new Date();

            const tasksToReschedule = await Task.findAll({
                where: {
                    status: 'pending',
                    [Op.or]: [
                        { startTime: { [Op.lt]: now } },
                        { deadLine: { [Op.lt]: now } }
                    ]
                },
                include: [{
                    model: TaskGroup,
                    required: true,
                    include: [{
                        model: TaskBoard,
                        required: true
                    }]
                }]
            });

            console.log(`[RescheduleJob] Tasks to reschedule: ${tasksToReschedule.length}`);

            for (const task of tasksToReschedule) {
                const userId = (task as any).TaskGroup?.TaskBoard?.userId;
                
                if (!userId) continue;

                let newDeadline = task.deadLine ? new Date(task.deadLine) : new Date();

                if (newDeadline <= now) {
                    newDeadline = new Date(now);
                    newDeadline.setHours(23, 59, 59, 999);
                }

                const duration = task.duration || 60;

                const newSlot = await schedulerService.findNextAvailableSlot(
                    userId,
                    duration,
                    newDeadline
                );

                if (newSlot) {
                    await task.update({
                        startTime: newSlot,
                        deadLine: newDeadline
                    });
                    console.log(`[RescheduleJob] Task (ID: ${task.id}) rescheduled to: ${newSlot.toISOString()}`);
                } else {
                    console.log(`[RescheduleJob] Failed to find an available time slot for the task (ID: ${task.id}) within the specified deadline.`);
                }
            }

            console.log('[RescheduleJob] Rescheduling completed.');
        } catch (error) {
            console.error('[RescheduleJob] Error occurred while rescheduling:', error);
        }
    });
};

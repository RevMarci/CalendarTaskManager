import { Op } from 'sequelize';
import { Task, Event } from '../models';

interface TimeInterval {
    start: Date;
    end: Date;
}

class SchedulerService {
    
    /**
     * PUBLIC API
     */
    public async findNextAvailableSlot(
        userId: number, 
        durationMinutes: number, 
        deadline: Date
    ): Promise<Date | null> {
        const now = new Date();
        
        if (deadline <= now) return null;

        const busyIntervals = await this.getBusyIntervals(userId, now, deadline);
        
        return this.findGapInIntervals(busyIntervals, durationMinutes, now, deadline);
    }

    public shouldSchedule(deadLine?: Date, startTime?: Date, status?: string): boolean {
        const now = new Date();

        if (status === 'completed' || !deadLine) {
            return false;
        }

        let schedule = deadLine > now && (!startTime || startTime < now);

        return schedule;
    }

    private async getBusyIntervals(userId: number, start: Date, end: Date): Promise<TimeInterval[]> {
        const events = await this.fetchEvents(userId, start, end);
        const tasks = await this.fetchScheduledTasks(userId, start, end);

        const intervals = this.mergeIntervals(events, tasks);
        return intervals.sort((a, b) => a.start.getTime() - b.start.getTime());
    }

    private async fetchEvents(userId: number, start: Date, end: Date): Promise<Event[]> {
        return await Event.findAll({
            where: {
                userId,
                start: { [Op.lt]: end },
                end: { [Op.gt]: start }
            }
        });
    }

    private async fetchScheduledTasks(userId: number, start: Date, end: Date): Promise<Task[]> {
        return await Task.findAll({
            where: {
                userId,
                startTime: { 
                    [Op.gt]: start,
                    [Op.lt]: end
                }
            }
        });
    }

    private mergeIntervals(events: Event[], tasks: Task[]): TimeInterval[] {
        const intervals: TimeInterval[] = [
            ...events.map(e => ({ 
                start: new Date(e.start), 
                end: new Date(e.end || e.start) 
            })),
            ...tasks.map(t => ({ 
                start: new Date(t.startTime!), 
                end: new Date(new Date(t.startTime!).getTime() + (t.duration! * 60000)) 
            }))
        ];

        return intervals;
    }

    private roundToNextQuarter(date: Date): Date {
        const rounded = new Date(date);
        rounded.setSeconds(0, 0);
        const minutes = rounded.getMinutes();
        const remainder = minutes % 15;
        
        if (remainder !== 0) {
            rounded.setMinutes(minutes + (15 - remainder));
        }
        
        return rounded;
    }

    private findGapInIntervals(
        intervals: TimeInterval[], 
        durationMinutes: number, 
        searchStart: Date, 
        deadline: Date
    ): Date | null {
        let currentPointer = this.roundToNextQuarter(searchStart);
        const durationMs = durationMinutes * 60000;

        for (const interval of intervals) {
            const gapSize = interval.start.getTime() - currentPointer.getTime();
            
            if (gapSize >= durationMs) {
                if (currentPointer.getTime() + durationMs <= deadline.getTime()) {
                    return currentPointer;
                }
            }

            if (interval.end.getTime() > currentPointer.getTime()) {
                currentPointer = interval.end;
            }
        }

        if (deadline.getTime() - currentPointer.getTime() >= durationMs) {
            return currentPointer;
        }

        return null;
    }
}

export const schedulerService = new SchedulerService();
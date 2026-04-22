import { Op } from 'sequelize';
import { Task, Event, TaskGroup, TaskBoard } from '../models';

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

    public shouldSchedule(deadLine?: Date, startTime?: Date, duration?: number, status?: string): boolean {
        const now = new Date();
        const endDate = startTime && duration 
            ? new Date(startTime.getTime() + duration * 60000) 
            : undefined;

        if (status === 'completed' || !deadLine) {
            return false;
        }

        let schedule = deadLine > now && (!endDate || endDate < now);

        return schedule;
    }

    private async getBusyIntervals(userId: number, start: Date, end: Date): Promise<TimeInterval[]> {
        const events = await this.fetchEvents(userId, start, end);
        const tasks = await this.fetchTasks(userId, start, end);

        const allIntervals = [...events, ...tasks].sort((a, b) => a.start.getTime() - b.start.getTime());
        
        return this.mergeIntervals(allIntervals);
    }

    private async fetchEvents(userId: number, start: Date, end: Date): Promise<TimeInterval[]> {
        const events = await Event.findAll({
            where: {
                userId,
                start: { [Op.lt]: end },
                end: { [Op.gt]: start }
            }
        });

        return events.map(e => ({ start: e.start, end: e.end }));
    }

    private async fetchTasks(userId: number, start: Date, end: Date): Promise<TimeInterval[]> {
        const tasks = await Task.findAll({
            where: {
                startTime: { [Op.ne]: null as any }
            },
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

        const intervals = tasks.map(t => ({
            start: t.startTime!,
            end: new Date(new Date(t.startTime!).getTime() + (t.duration! * 60000))
        }));

        return intervals.filter(i => i.start < end && i.end > start);
    }

    private mergeIntervals(intervals: TimeInterval[]): TimeInterval[] {
        if (intervals.length === 0) return [];

        const merged: TimeInterval[] = [intervals[0]];

        for (let i = 1; i < intervals.length; i++) {
            const current = intervals[i];
            const last = merged[merged.length - 1];

            if (current.start <= last.end) {
                last.end = new Date(Math.max(last.end.getTime(), current.end.getTime()));
            } else {
                merged.push(current);
            }
        }

        return merged;
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
            if (currentPointer >= interval.start && currentPointer < interval.end) {
                currentPointer = interval.end;
                continue;
            }

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
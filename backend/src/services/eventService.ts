import { Event } from '../models';
import { Op , WhereOptions } from 'sequelize';
import { rrulestr } from 'rrule';
import ExternalCalendar from '../models/ExternalCalendar';

export async function getAllEvents(userId: number, startDate?: string, endDate?: string): Promise<any[]> {
    const whereClause = buildDateRangeWhereClause(userId, startDate, endDate);

    const dbEvents = await Event.findAll({
        where: whereClause,
        include: [{
            model: ExternalCalendar,
            as: 'externalCalendar',
            attributes: ['color']
        }],
        order: [['start', 'ASC']]
    });

    if (!startDate || !endDate) {
        return dbEvents;
    }

    return expandRecurringEvents(dbEvents, new Date(startDate), new Date(endDate));
}

export async function getEventById (id: string, userId: number): Promise<Event | null> {
    return await Event.findOne({
        where: { id, userId }
    });
};

export async function createEvent (data: { title: string; start: Date; end?: Date; allDay?: boolean; description?: string; rrule?: string }, userId: number): Promise<Event> {
    return await Event.create({
        ...data,
        allDay: data.allDay || false,
        userId
    });
};

export async function deleteEvent (id: string, userId: number): Promise<boolean | null> {
    const event = await Event.findOne({ where: { id, userId } });
    if (!event) return null;
    
    await event.destroy();
    return true;
};

export async function updateEvent (id: string, userId: number, data: any): Promise<Event | null> {
    const event = await Event.findOne({ where: { id, userId } });
    if (!event) return null;

    return await event.update(data);
};

export async function getEventsByDate(userId: number, dateString: string): Promise<Event[]> {
    const startOfDay = new Date(`${dateString}T00:00:00.000Z`);
    const endOfDay = new Date(`${dateString}T23:59:59.999Z`);

    return await Event.findAll({
        where: {
            userId,
            start: {
                [Op.between]: [startOfDay, endOfDay]
            }
        }
    });
};

function buildDateRangeWhereClause(userId: number, startDate?: string, endDate?: string): WhereOptions {
    const whereClause: any = { userId: userId };

    if (startDate && endDate) {
        whereClause[Op.or] = [
            {
                rrule: { [Op.is]: null },
                start: { [Op.lte]: endDate },
                [Op.or]: [
                    { end: { [Op.gte]: startDate } },
                    { 
                        [Op.and]: [
                            { end: null }, 
                            { start: { [Op.gte]: startDate } }
                        ] 
                    }
                ]
            },
            {
                rrule: { [Op.not]: null },
                start: { [Op.lte]: endDate }
            }
        ];
    }

    return whereClause;
}

function expandRecurringEvents(dbEvents: Event[], windowStart: Date, windowEnd: Date): any[] {
    const expandedEvents: any[] = [];

    for (const event of dbEvents) {
        const eventData = event.toJSON();

        if (!eventData.rrule) {
            expandedEvents.push(eventData);
        } else {
            const occurrences = generateOccurrences(eventData, windowStart, windowEnd);
            expandedEvents.push(...occurrences);
        }
    }

    return expandedEvents;
}

function generateOccurrences(eventData: any, windowStart: Date, windowEnd: Date): any[] {
    const occurrencesList: any[] = [];
    
    try {
        const rule = rrulestr(eventData.rrule, { dtstart: new Date(eventData.start) });
        const occurrences = rule.between(windowStart, windowEnd, true);
        
        const durationMs = eventData.end ? new Date(eventData.end).getTime() - new Date(eventData.start).getTime() : 0;

        for (const date of occurrences) {
            const newStart = new Date(date);
            const newEnd = eventData.end ? new Date(newStart.getTime() + durationMs) : null;

            occurrencesList.push({
                ...eventData,
                id: `${eventData.id}_${newStart.getTime()}`, 
                originalEventId: eventData.id, 
                start: newStart,
                end: newEnd,
            });
        }
    } catch (error) {
        console.error(`Error parsing rrule for event ${eventData.id}:`, error);
        occurrencesList.push(eventData); 
    }

    return occurrencesList;
}

import { Event } from '../models';
import { Op } from 'sequelize';

export async function getAllEvents(userId: number, startDate?: string, endDate?: string): Promise<Event[]> {
    const whereClause: any = {
        userId: userId
    };

    if (startDate && endDate) {
        whereClause[Op.and] = [
            { start: { [Op.lte]: endDate } },
            {
                [Op.or]: [
                    { end: { [Op.gte]: startDate } },
                    { 
                        [Op.and]: [
                            { end: null }, 
                            { start: { [Op.gte]: startDate } }
                        ] 
                    }
                ]
            }
        ];
    }

    return await Event.findAll({
        where: whereClause,
        order: [['start', 'ASC']]
    });
};

export async function getEventById (id: string, userId: number): Promise<Event | null> {
    return await Event.findOne({
        where: { id, userId }
    });
};

export async function createEvent (data: { title: string; start: Date; end?: Date; allDay?: boolean; description?: string }, userId: number): Promise<Event> {
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

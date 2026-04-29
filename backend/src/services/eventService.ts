import { Event } from '../models';

export async function getAllEvents (userId: number): Promise<Event[]> {
    return await Event.findAll({
        where: { userId }
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
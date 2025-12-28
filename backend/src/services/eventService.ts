import { Event } from '../models';

export const getAllEvents = async (userId: number) => {
    return await Event.findAll({
        where: { userId }
    });
};

export const getEventById = async (id: string, userId: number) => {
    return await Event.findOne({
        where: { id, userId }
    });
};

export const createEvent = async (data: { title: string; start: Date; end?: Date; allDay?: boolean }, userId: number) => {
    return await Event.create({
        ...data,
        allDay: data.allDay || false,
        userId
    });
};

export const deleteEvent = async (id: string, userId: number) => {
    const event = await Event.findOne({ where: { id, userId } });
    if (!event) return null;
    
    await event.destroy();
    return true;
};

export const updateEvent = async (id: string, userId: number, data: any) => {
    const event = await Event.findOne({ where: { id, userId } });
    if (!event) return null;

    return await event.update(data);
};
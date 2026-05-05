import ExternalCalendar from '../models/ExternalCalendar';
import ical from 'node-ical';
import Event from '../models/Event';
import { Op } from 'sequelize';

export async function getExternalCalendars(userId: number) {
    return await ExternalCalendar.findAll({
        where: { userId },
        order: [['createdAt', 'DESC']]
    });
}

export async function createExternalCalendar(userId: number, data: { name: string; url: string; color?: string }) {
    return await ExternalCalendar.create({
        userId,
        name: data.name,
        url: data.url,
        color: data.color
    });
}

export async function deleteExternalCalendar(id: string | number, userId: number) {
    const deletedCount = await ExternalCalendar.destroy({
        where: { 
            id: id,
            userId: userId
        }
    });
    
    return deletedCount > 0;
}

export async function syncCalendar(calendarId: number, userId: number) {
    const calendar = await ExternalCalendar.findOne({ where: { id: calendarId, userId } });
    if (!calendar) throw new Error('Calendar not found or access denied');

    const webEvents = await ical.async.fromURL(calendar.url);

    const existingDbEvents = await Event.findAll({
        where: { externalCalendarId: calendar.id }
    });
    
    const dbEventsMap = new Map(existingDbEvents.map(e => [e.externalEventId, e]));

    const eventsToCreate: any[] = [];
    const eventsToUpdate: any[] = [];
    const seenUids = new Set<string>();

    for (const key in webEvents) {
        const ev = webEvents[key];
        
        if (!ev || ev.type !== 'VEVENT') {
            continue; 
        }

        const uid = ev.uid;
        if (!uid) continue;

        seenUids.add(uid);

        const title = ev.summary || 'Untitled Event';
        const start = ev.start;
        const end = ev.end || ev.start;
        const description = ev.description || '';
        const allDay = ev.datetype === 'date'; 
        
        let rruleStr = null;
        if (ev.rrule) {
            rruleStr = ev.rrule.toString(); 
        }

        const eventData = {
            title: title.toString(),
            start,
            end,
            description: description.toString(),
            allDay,
            userId,
            rrule: rruleStr,
            externalCalendarId: calendar.id,
            externalEventId: uid
        };

        if (dbEventsMap.has(uid)) {
            const existing = dbEventsMap.get(uid)!;
            eventsToUpdate.push({ ...eventData, id: existing.id });
            dbEventsMap.delete(uid);
        } else {
            eventsToCreate.push(eventData);
        }
    }
    
    if (eventsToCreate.length > 0) {
        await Event.bulkCreate(eventsToCreate);
    }

    if (eventsToUpdate.length > 0) {
        await Promise.all(eventsToUpdate.map(data => 
            Event.update(data, { where: { id: data.id } })
        ));
    }

    const uidsToDelete = Array.from(dbEventsMap.keys()).filter((uid): uid is string => uid !== null && uid !== undefined);
    
    if (uidsToDelete.length > 0) {
        await Event.destroy({
            where: {
                externalCalendarId: calendar.id,
                externalEventId: {
                    [Op.in]: uidsToDelete
                }
            }
        });
    }

    calendar.lastSyncedAt = new Date();
    await calendar.save();

    return { 
        created: eventsToCreate.length, 
        updated: eventsToUpdate.length, 
        deleted: uidsToDelete.length 
    };
}

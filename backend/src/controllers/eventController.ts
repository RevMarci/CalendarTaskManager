import { Request, Response } from 'express';
import * as eventService from '../services/eventService';

export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventService.getAllEvents(req.user!.id);
        res.status(200).json(events);
    } catch (error) {
        console.error('Error in getEvents:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
};

export const getEvent = async (req: Request, res: Response) => {
    try {
        const event = await eventService.getEventById(req.params.id, req.user!.id);

        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        res.status(200).json(event);
    } catch (error) {
        console.error(`Error in getEvent (${req.params.id}):`, error);
        res.status(500).json({ message: 'Error fetching event' });
    }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        const { title, start, end, allDay } = req.body;

        if (!title || !start) {
            res.status(400).json({ message: 'Title and start date are required' });
            return;
        }

        const event = await eventService.createEvent({ title, start, end, allDay }, req.user!.id);
        res.status(201).json(event);
    } catch (error) {
        console.error('Error in createEvent:', error);
        res.status(500).json({ message: 'Error creating event' });
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const result = await eventService.deleteEvent(req.params.id, req.user!.id);

        if (!result) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error('Error in deleteEvent:', error);
        res.status(500).json({ message: 'Error deleting event' });
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const updatedEvent = await eventService.updateEvent(req.params.id, req.user!.id, req.body);

        if (!updatedEvent) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error in updateEvent:', error);
        res.status(500).json({ message: 'Error updating event' });
    }
};
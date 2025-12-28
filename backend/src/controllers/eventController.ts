import { Request, Response } from 'express';
import * as eventService from '../services/eventService';
import { sendSuccess, sendError } from '../utils/response';

export const getEvents = async (req: Request, res: Response) => {
    try {
        const events = await eventService.getAllEvents(req.user!.id);
        sendSuccess(res, events, 'Events fetched successfully');
    } catch (error) {
        console.error('Error in getEvents:', error);
        sendError(res, 'Error fetching events', 500, error);
    }
};

export const getEvent = async (req: Request, res: Response) => {
    try {
        const event = await eventService.getEventById(req.params.id, req.user!.id);

        if (!event) {
            return sendError(res, 'Event not found', 404);
        }

        sendSuccess(res, event);
    } catch (error) {
        console.error(`Error in getEvent (${req.params.id}):`, error);
        sendError(res, 'Error fetching event', 500, error);
    }
};

export const createEvent = async (req: Request, res: Response) => {
    try {
        const { title, start, end, allDay } = req.body;

        if (!title || !start) {
            return sendError(res, 'Title and start date are required', 400);
        }

        const event = await eventService.createEvent({ title, start, end, allDay }, req.user!.id);
        sendSuccess(res, event, 'Event created successfully', 201);
    } catch (error) {
        console.error('Error in createEvent:', error);
        sendError(res, 'Error creating event', 500, error);
    }
};

export const deleteEvent = async (req: Request, res: Response) => {
    try {
        const result = await eventService.deleteEvent(req.params.id, req.user!.id);

        if (!result) {
            return sendError(res, 'Event not found', 404);
        }

        sendSuccess(res, { id: req.params.id }, 'Event deleted successfully');
    } catch (error) {
        console.error('Error in deleteEvent:', error);
        sendError(res, 'Error deleting event', 500, error);
    }
};

export const updateEvent = async (req: Request, res: Response) => {
    try {
        const updatedEvent = await eventService.updateEvent(req.params.id, req.user!.id, req.body);

        if (!updatedEvent) {
            return sendError(res, 'Event not found', 404);
        }

        sendSuccess(res, updatedEvent, 'Event updated successfully');
    } catch (error) {
        console.error('Error in updateEvent:', error);
        sendError(res, 'Error updating event', 500, error);
    }
};
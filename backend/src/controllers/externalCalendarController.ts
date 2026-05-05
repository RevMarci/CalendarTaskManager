import { Request, Response } from 'express';
import * as externalCalendarService from '../services/externalCalendarService';
import { sendSuccess, sendError } from '../utils/response';

export async function getExternalCalendars (req: Request, res: Response): Promise<void> {
    try {
        const calendars = await externalCalendarService.getExternalCalendars(req.user!.id);
        sendSuccess(res, calendars, 'External calendars fetched successfully');
    } catch (error) {
        console.error('Error in getExternalCalendars:', error);
        sendError(res, 'Error fetching external calendars', 500, error);
    }
}

export async function createExternalCalendar (req: Request, res: Response): Promise<void> {
    try {
        const { name, url, color } = req.body;

        if (!name || !url) {
            return sendError(res, 'Name and URL are required', 400);
        }

        const calendar = await externalCalendarService.createExternalCalendar(req.user!.id, { name, url, color });
        
        try {
            await externalCalendarService.syncCalendar(calendar.id, req.user!.id);
        } catch (syncError) {
            console.error(`Initial sync failed for calendar ${calendar.id}:`, syncError);
        }

        const calendars = await externalCalendarService.getExternalCalendars(req.user!.id);
        const updatedCalendar = calendars.find(c => c.id === calendar.id) || calendar;

        sendSuccess(res, updatedCalendar, 'External calendar created successfully', 201);
    } catch (error) {
        console.error('Error in createExternalCalendar:', error);
        sendError(res, 'Error creating external calendar', 500, error);
    }
}

export async function deleteExternalCalendar (req: Request, res: Response): Promise<void> {
    try {
        const result = await externalCalendarService.deleteExternalCalendar(req.params.id, req.user!.id);

        if (!result) {
            return sendError(res, 'External calendar not found or you do not have permission', 404);
        }

        sendSuccess(res, { id: req.params.id }, 'External calendar deleted successfully');
    } catch (error) {
        console.error('Error in deleteExternalCalendar:', error);
        sendError(res, 'Error deleting external calendar', 500, error);
    }
}

import express, { Request, Response } from 'express';
import { Event } from '../models';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);

router.get('/', async (req: Request, res: Response) => {
    try {
        console.log(`Fetching events for user ID: ${req.user?.id}`);
        const events = await Event.findAll({
            where: { userId: req.user!.id }
        });
        res.status(200).json(events);
    } catch (error) {
        console.error('Error in GET /api/events:', error);
        res.status(500).json({ message: 'Error fetching events' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const event = await Event.findOne({
            where: { id: req.params.id, userId: req.user!.id }
        });

        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        res.status(200).json(event);
    } catch (error) {
        console.error(`Error in GET /api/events/${req.params.id}:`, error);
        res.status(500).json({ message: 'Error fetching event' });
    }
});

router.post('/', async (req: Request, res: Response) => {
    try {
        const { title, start, end, allDay } = req.body;
        
        if (!title || !start) {
            res.status(400).json({ message: 'Title and start date are required' });
            return;
        }

        const event = await Event.create({
            title,
            start,
            end,
            allDay: allDay || false,
            userId: req.user!.id
        });
        res.status(201).json(event);
    } catch (error) {
        console.error('Error in POST /api/events:', error);
        res.status(500).json({ message: 'Error creating event' });
    }
});

router.delete('/:id', async (req: Request, res: Response) => {
    try {
        const event = await Event.findOne({
            where: { id: req.params.id, userId: req.user!.id }
        });

        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        await event.destroy();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        console.error('Error in DELETE /api/events:', error);
        res.status(500).json({ message: 'Error deleting event' });
    }
});

router.put('/:id', async (req: Request, res: Response) => {
    try {
        const event = await Event.findOne({
            where: { id: req.params.id, userId: req.user!.id }
        });

        if (!event) {
            res.status(404).json({ message: 'Event not found' });
            return;
        }

        const updatedEvent = await event.update(req.body);
        res.status(200).json(updatedEvent);
    } catch (error) {
        console.error('Error in PUT /api/events:', error);
        res.status(500).json({ message: 'Error updating event' });
    }
});

export default router;
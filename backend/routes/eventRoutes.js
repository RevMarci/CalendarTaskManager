import express from 'express';
import Event from '../models/Event.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const event = await Event.create(req.body);

        res.status(201).json({
            message: 'Event created successfully',
            data: event,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Failed to create event',
            error: error.message,
        });
    }
});

router.get('/', async (req, res) => {
    const events = await Event.findAll();
    res.json(events);
});

router.get('/:id', async (req, res) => {
    const event = await Event.findByPk(req.params.id);

    if (!event) {
        return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
        message: 'Event found successfully',
        data: event,
    });
});

router.put('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        await event.update(req.body);

        res.json({
            message: 'Event updated successfully',
            data: event,
        });
    } catch (error) {
        res.status(400).json({
            message: 'Failed to update event',
            error: error.message,
        });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const event = await Event.findByPk(req.params.id);

        if (!event) {
            return res.status(404).json({ error: 'Event not found' });
        }

        await event.destroy();

        res.json({ message: 'Event deleted' });
    } catch (error) {
        res.status(400).json({
            message: 'Failed to delete event',
            error: error.message,
        });
    }
});

export default router;

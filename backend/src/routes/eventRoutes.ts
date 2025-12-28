import express from 'express';
import { protect } from '../middleware/authMiddleware';
import { 
    getEvents, 
    getEvent, 
    createEvent, 
    deleteEvent, 
    updateEvent 
} from '../controllers/eventController';

const router = express.Router();

router.use(protect);

router.get('/', getEvents);
router.get('/:id', getEvent);
router.post('/', createEvent);
router.delete('/:id', deleteEvent);
router.put('/:id', updateEvent);

export default router;
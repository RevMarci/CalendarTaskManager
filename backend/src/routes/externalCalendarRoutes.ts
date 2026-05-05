import { Router } from 'express';
import * as externalCalendarController from '../controllers/externalCalendarController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.use(protect);

router.get('/', externalCalendarController.getExternalCalendars);
router.post('/', externalCalendarController.createExternalCalendar);
router.delete('/:id', externalCalendarController.deleteExternalCalendar);

export default router;

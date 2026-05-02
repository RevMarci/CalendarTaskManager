import { Router } from 'express';
import { getLogByDate, verifyUploadedLog } from '../controllers/dailyLogController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.get('/date/:date', protect, getLogByDate);
router.post('/verify', verifyUploadedLog);

export default router;

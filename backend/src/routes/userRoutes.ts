import express from 'express';
import { getUserProfile, changePassword } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.patch('/password', protect, changePassword);

export default router;
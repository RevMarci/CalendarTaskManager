import express from 'express';
import { protect } from '../../middleware/authMiddleware';
import { 
    getTasks, 
    getTask, 
    createTask, 
    deleteTask, 
    updateTask,
    updatePositions
} from '../../controllers/task/taskController';

const router = express.Router();

router.use(protect);

router.get('/', getTasks);
router.get('/:id', getTask);
router.post('/', createTask);
router.delete('/:id', deleteTask);
router.put('/:id', updateTask);
router.patch('/positions', updatePositions);

export default router;
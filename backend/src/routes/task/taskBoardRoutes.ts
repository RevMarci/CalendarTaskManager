import express from "express";
import { protect } from '../../middleware/authMiddleware';
import { 
    createBoard, 
    getBoards, 
    getBoard, 
    updateBoard, 
    deleteBoard 
} from '../../controllers/task/taskBoardController';

const router = express.Router();

router.use(protect);

router.get('/', getBoards);
router.post('/', createBoard);
router.get('/:id', getBoard);
router.put('/:id', updateBoard);
router.delete('/:id', deleteBoard);
    
export default router;
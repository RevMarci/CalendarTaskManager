import express from "express";
import { protect } from '../../middleware/authMiddleware';

import { 
    getGroups, 
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup,
    updatePositions
} from '../../controllers/task/taskGroupController';

const router = express.Router();

router.use(protect);

router.get('/:taskBoardId/groups', getGroups);
router.get('/:id', getGroup);
router.post('/', createGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);
router.patch('/positions', updatePositions);

export default router;

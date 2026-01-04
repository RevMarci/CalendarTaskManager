import express from "express";
import { protect } from '../../middleware/authMiddleware';

import { 
    getGroups, 
    getGroup,
    createGroup,
    updateGroup,
    deleteGroup
} from '../../controllers/task/taskGroupController';

const router = express.Router();

router.use(protect);

router.get('/:taskBoardId/groups', getGroups);
router.get('/:id', getGroup);
router.post('/', createGroup);
router.put('/:id', updateGroup);
router.delete('/:id', deleteGroup);

export default router;

import express from 'express';
import { getAddBoard, postAddBoard } from '../controllers/admin';

const router = express.Router();

// all routes prepend with /admin
router.get('/board', getAddBoard);
router.post('/add-board', postAddBoard);

export default router;

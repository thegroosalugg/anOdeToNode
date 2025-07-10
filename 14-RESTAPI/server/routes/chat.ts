import express from 'express';
import { getChats, deleteChats } from '../controllers/chatController';

const router = express.Router();

// all routes prepended by /chat & JWT middleware
router.get('/all',          getChats);
router.delete('/delete',  deleteChats);

export default router;

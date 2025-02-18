import express from 'express';
import { getChats, findChat, deleteChat } from '../controllers/chatController';

const router = express.Router();

// all routes prepended by /chat & JWT middleware
router.get('/all',          getChats);
router.get('/find/:userId', findChat);
router.delete('/delete',  deleteChat);

export default router;

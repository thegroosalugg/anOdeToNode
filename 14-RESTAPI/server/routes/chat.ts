import express from 'express';
import { getChats, newChat, deleteChat } from '../controllers/chatController';

const router = express.Router();

// all routes prepended by /chat & JWT middleware
router.get('/all',                 getChats);
router.post('/new',                 newChat);
router.delete('/delete/:chatId', deleteChat);

export default router;

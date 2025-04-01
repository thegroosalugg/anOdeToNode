import express from "express";
import { getMessages, newMessage } from "../controllers/msgController";
import { validateField } from "../validation/validators";

const router = express.Router();

// all routes prepended by /chat & JWT middleware
router.get('/messages/:chatId',                                    getMessages);
router.post('/new-msg/:userId', validateField('content', [1, 500]), newMessage);

export default router;

import express from 'express';
import { getReplies, postReply, deleteReply } from '../controllers/replyController';
import { validateField } from '../validation/validators';

const router = express.Router();

// all routes prepended by /post & JWT middleware
router.get('/replies/:postId', getReplies);
router.post('/reply/:postId', validateField('content', [10, 1000]), postReply);
router.delete('/delete-reply/:replyId', deleteReply);

export default router;

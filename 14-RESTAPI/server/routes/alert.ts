import Express from 'express';
import { readRequests, clearRequests, readReplies, clearReplies } from '../controllers/alertController';

const router = Express.Router();

// all routes prepended by /alert & JWT middleware
router.post('/social/read', readRequests);
router.post('/social/hide/:alertId', clearRequests);
router.post('/replies/read', readReplies);
router.post('/reply/hide/:replyId', clearReplies);

export default router;

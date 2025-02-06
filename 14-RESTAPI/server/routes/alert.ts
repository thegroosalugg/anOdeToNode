import Express from 'express';
import { readSocials, clearSocials, readReplies, clearReplies } from '../controllers/alertController';

const router = Express.Router();

// all routes prepended by /alerts & JWT middleware
router.get('/social',                readSocials);
router.get('/social/hide/:alertId', clearSocials);
router.get('/replies',               readReplies);
router.get('/reply/hide/:replyId',  clearReplies);

export default router;

import Express from 'express';
import { markAsRead, clearAlert } from '../controllers/alertController';

const router = Express.Router();

// all routes prepended by /alert & JWT middleware
router.post('/read', markAsRead);
router.post('/:alertId', clearAlert);

export default router;

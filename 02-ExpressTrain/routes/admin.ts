import express from 'express';
import { getUserItems, getAddItem, postAddItem } from '../controllers/admin';

const router = express.Router();

// all routes prepend with /admin
router.get('/items', getUserItems);
router.get('/add-item', getAddItem);
router.post('/add-item', postAddItem);

export default router;

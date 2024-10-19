import express from 'express';
import { getUserItems, getAddItem, postAddItem, getEditItem, postEditItem } from '../controllers/admin';

const router = express.Router();

// all routes prepend with /admin
router.get('/items', getUserItems);
router.get('/add-item', getAddItem);
router.post('/add-item', postAddItem);
router.get('/edit-item/:itemId', getEditItem);
router.post('/edit-item', postEditItem);

export default router;

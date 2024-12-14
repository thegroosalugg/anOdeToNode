import express from 'express';
import { getUserItems, getItemForm, postAddItem, postEditItem, postDeleteItem } from '../controllers/admin';

const router = express.Router();

// all routes prepend with /admin
router.get('/items', getUserItems);
router.get('/item-form/:itemId?', getItemForm);
router.post('/add-item', postAddItem);
router.post('/edit-item', postEditItem);
router.post('/delete-item', postDeleteItem);

export default router;

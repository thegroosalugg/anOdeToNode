import express from 'express';
import { getItems, getItemById, getCart, postUpdateCart, getOrders, postCreateOrder } from '../controllers/store';
import authenticate from '../middleware/authenticate';

const router = express.Router();

router.get('/', getItems);
router.get('/store/:itemId', getItemById); // must load after controllers prepended by '/store/', otherwise this will replace them
router.get('/cart', authenticate, getCart);
router.post('/cart/:itemId/:action', authenticate, postUpdateCart);
router.get('/orders', authenticate, getOrders);
router.post('/new-order', authenticate, postCreateOrder);

export default router;

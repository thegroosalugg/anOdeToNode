import express from 'express';
import { getItems, getItemById, getCart, postAddToCart, postRemoveFromCart } from '../controllers/store';

const router = express.Router();

router.get('/', getItems);
router.get('/store/:itemId', getItemById); // must load after controllers prepended by '/store/', otherwise this will replace them
router.get('/cart', getCart);
router.post('/cart/add', postAddToCart);
router.post('/cart/remove', postRemoveFromCart);

export default router;

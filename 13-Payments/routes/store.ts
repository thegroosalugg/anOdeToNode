import express from 'express';
import {
  getItems,
  getItemById,
  getCart,
  postUpdateCart,
  postCheckout,
  getOrders,
  getNewOrder,
} from '../controllers/store';
import authenticate from '../middleware/authenticate';

const router = express.Router();

router.get('/', getItems);
// must load after controllers prepended by '/store/', otherwise this will replace them
router.get('/store/:itemId', getItemById);
router.get('/cart', authenticate, getCart);
router.post('/cart/:itemId/:action', authenticate, postUpdateCart);
router.post('/checkout', authenticate, postCheckout);
router.get('/orders', authenticate, getOrders);
router.get('/new-order', authenticate, getNewOrder);

export default router;

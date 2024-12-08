import { RequestHandler } from 'express';
import Item from '../models/Item';
import Order from '../models/Order';
import errorMsg from '../util/errorMsg';

const getItems: RequestHandler = async (req, res, next) => {
  try {
    const items = await Item.find();
    res.render('body', {
         title: 'Home',
      isActive: '/',
          view: 'itemsAll',
        styles: ['itemsAll'],
        locals: { items, isAdmin: false },
    });
  } catch (error) {
    errorMsg({ error, msg: 'getItems' });
    res.redirect('/');
  }
};

const getItemById: RequestHandler = async (req, res, next) => {
  const { itemId } = req.params;
  try {
    const item = await Item.findById(itemId);
    res.render('body', {
         title: item?.name || 'Not Found',
      isActive: '/',
          view: 'itemId',
        styles: ['itemId'],
        locals: { item },
    });
  } catch (error) {
    errorMsg({ error, msg: 'getItemById' });
    res.redirect('/');
  }
};

// prepended by authenticate middleware
const getCart: RequestHandler = async (req, res, next) => {
  try {
    const items = await req.user?.getCart();
    res.render('body', {
         title: 'Your Cart',
      isActive: '/cart',
          view: 'cart',
        styles: ['cart'],
        locals: { items },
    });
  } catch (error) {
    errorMsg({ error, msg: 'getCart' });
    res.redirect('/');
  }
};

// /cart/:itemId/:action - prepended by authenticate middleware
const postUpdateCart: RequestHandler = async (req, res, next) => {
  const { itemId, action } = req.params;
  const quantity = { add: 1, remove: -1 }[action];

  try {
    const item = await Item.findById(itemId);
    if (item && req.user && (quantity === 1 || quantity === -1)) {
      await req.user.updateCart(itemId, quantity);
    }
    res.redirect('/cart');
  } catch (error) {
    errorMsg({ error, msg: 'postUpdateCart' });
    res.redirect('/');
  }
};

// prepended by authenticate middleware
const getOrders: RequestHandler = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'user._id': req.user?._id });
    res.render('body', {
          title: 'Your Orders',
      isActive: '/admin/items',
          view: 'orders',
        styles: ['orders', 'userNav'],
        locals: { orders },
    });
  } catch (error) {
    errorMsg({ error, msg: 'getOrders' });
    res.redirect('/');
  }
};

// prepended by authenticate middleware
const postCreateOrder: RequestHandler = async (req, res, next) => {
  if (!req.user) return;
  try {
    const { _id, name, email } = req.user;
    const items = await req.user.getCart();
    await new Order({ user: { _id, name, email }, items }).save();
    req.user.cart = [];
    await req.user.save();
    res.redirect('/orders');
  } catch (error) {
    errorMsg({ error, msg: 'postCreateOrder' });
    res.redirect('/');
  }
};

export { getItems, getItemById, getCart, postUpdateCart, getOrders, postCreateOrder };

import { RequestHandler } from 'express';
import Item, { IItem } from '../models/Item';
import Order from '../models/Order';

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
    console.log('getItems Error:', error);
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
    console.log('getItemById Error:', error);
  }
};

const getCart: RequestHandler = async (req, res, next) => {
  try {
    let items: IItem[] = [];
    if (req.user) items = await req.user.getCart();

    res.render('body', {
         title: 'Your Cart',
      isActive: '/cart',
          view: 'cart',
        styles: ['cart'],
        locals: { items },
    });
  } catch (error) {
    console.log('getCart Error:', error);
  }
};

// /cart/:itemId/:action
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
    console.log('postAddToCart Error:', error);
  }
};

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
    console.log('getOrders Error:', error);
  }
};

const postCreateOrder: RequestHandler = async (req, res, next) => {
  try {
    if (req.user) {
      const { _id, name, email } = req.user;
      const items = await req.user.getCart();
      await new Order({ user: { _id, name, email }, items }).save();
      req.user.cart = [];
      await req.user.save();
      res.redirect('/orders');
    }
  } catch (error) {
    console.log('postCreateOrder Error:', error);
  }
};

export { getItems, getItemById, getCart, postUpdateCart, getOrders, postCreateOrder };

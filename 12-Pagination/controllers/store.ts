import { RequestHandler } from 'express';
import Item from '../models/Item';
import Order from '../models/Order';
import errorMsg from '../util/errorMsg';
import formatDate from '../util/formateDate';

const getItems: RequestHandler = async (req, res, next) => {
  const page = +(req.query.page || 1);
  const docsPerPage = 3;

  try {
    const docCount = await Item.find().countDocuments(); // returns only no. of DB entries
    const items     = await Item.find()
      .skip((page - 1) * docsPerPage) // skips first amount of results, so page * limit
      .limit(docsPerPage); // limits results to how many you want on the page
      // skip + limit = clamp(min, max)

    const pagination = { active: page, docsPerPage, docCount };

    res.render('body', {
         title: 'Home',
      isActive: '/',
          view: 'itemList',
        styles: ['itemList', 'pagination'],
        locals: { items, isAdmin: false, pagination },
    });
  } catch (error) {
    const err = new Error(error as string);
    return next({ ...err, status: 500 }); // return next will reach special 500 middleware defined in app
  }
};

const getItemById: RequestHandler = async (req, res, next) => {
  const { itemId } = req.params;
  try {
    const item = await Item.findById(itemId);
    res.render('body', {
         title: item?.name || 'Not Found',
      isActive: '/',
          view: 'itemView',
        styles: ['itemView'],
        locals: { item },
    });
  } catch (error) {
    errorMsg({ error, where: 'getItemById' });
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
        styles: ['cart', 'dashboard'],
        locals: { items },
    });
  } catch (error) {
    errorMsg({ error, where: 'getCart' });
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
    errorMsg({ error, where: 'postUpdateCart' });
    res.redirect('/');
  }
};

// prepended by authenticate middleware
const getOrders: RequestHandler = async (req, res, next) => {
  const page = +(req.query.page || 1);
  const docsPerPage = 2;

  try {
    const docCount = await Order.find({ 'user._id': req.user?._id }).countDocuments();
    const orders = await Order.find({ 'user._id': req.user?._id })
      .skip((page -1) * docsPerPage)
      .limit(docsPerPage);

    const pagination = { active: page, docsPerPage, docCount };

    res.render('body', {
          title: 'Your Orders',
      isActive: '/admin/items',
          view: 'orders',
        styles: ['orders', 'dashboard', 'userInfo', 'pagination'],
        locals: { orders, formatDate, pagination },
    });
  } catch (error) {
    errorMsg({ error, where: 'getOrders' });
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
    errorMsg({ error, where: 'postCreateOrder' });
    res.redirect('/');
  }
};

export { getItems, getItemById, getCart, postUpdateCart, getOrders, postCreateOrder };

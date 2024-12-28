import { RequestHandler } from 'express';
import Item from '../models/Item';
import Order from '../models/Order';
import errorMsg from '../util/errorMsg';
import formatDate from '../util/formateDate';
import Stripe from 'stripe';
import dotenv from 'dotenv';
       dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET!);

const getItems: RequestHandler = async (req, res, next) => {
  const page = +(req.query.page || 1);
  const docsPerPage = 3;

  try {
    const docCount = await Item.find().countDocuments(); // returns only no. of DB entries
    const items    = await Item.find()
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
          view:  'itemView',
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
          view:  'cart',
        styles: ['cart', 'dashboard'],
        locals: { items },
    });
  } catch (error) {
    errorMsg({ error, where: 'getCart' });
    res.redirect('/');
  }
};

// prepended by authenticate middleware
const postCheckout: RequestHandler = async (req, res, next) => {
  try {
    const items = await req.user!.getCart(); // user guaranteed by middleware
    // line_items will throw error if checkout accessed by false POST & empty cart
    const line_items = items.map(({ name, desc, price, quantity }) => ({
        quantity, // require & reserved stripe props
      price_data: {
            currency: 'usd',
         unit_amount: price * 100, // price must be in cents in STRIPE
        product_data: { name, description: desc },
      },
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
            mode: 'payment',
      line_items,
      success_url: req.protocol + '://' + req.get('host') + '/new-order',
       cancel_url: req.protocol + '://' + req.get('host') + '/cart',
    });

    res.redirect(303, session.url!);
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
    const orders   = await Order.find({ 'user._id': req.user?._id })
      .skip((page -1) * docsPerPage)
      .limit(docsPerPage);

    const pagination = { active: page, docsPerPage, docCount };

    res.render('body', {
          title: 'Your Orders',
      isActive: '/admin/items',
          view:  'orders',
        styles: ['orders', 'dashboard', 'userInfo', 'pagination'],
        locals: { orders, formatDate, pagination },
    });
  } catch (error) {
    errorMsg({ error, where: 'getOrders' });
    res.redirect('/');
  }
};

// must be a GET request as required by STRIPE redirect
// prepended by authenticate middleware
const getNewOrder: RequestHandler = async (req, res, next) => {
  try {
    const user = req.user! // guaranteed by middleware
    const { _id, name, email } = user;
    const items = await user.getCart();
    await new Order({ user: { _id, name, email }, items }).save();
    user.cart = [];
    await user.save();
    res.redirect('/orders');
  } catch (error) {
    errorMsg({ error, where: 'getNewOrder' });
    res.redirect('/');
  }
};

export {
  getItems,
  getItemById,
  getCart,
  postUpdateCart,
  postCheckout,
  getOrders,
  getNewOrder,
};

import { RequestHandler } from 'express';
import Item from '../models/Item';

const getItems: RequestHandler = async (req, res, next) => {
  try {
    const items = await Item.fetchAll();
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
    let items = [];
    if (req.user) items = await req.user.getCart() as any[];

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

const getOrders: RequestHandler = (req, res, next) => {
  // req.user?.getOrders({ include: ['items'] }).then((orders) => {
  //   res.render('body', {
  //        title: 'Your Orders',
  //     isActive: '/admin/items',
  //         view: 'orders',
  //       styles: ['orders', 'userNav'],
  //       locals: { orders },
  //   });
  // });
};

const postCreateOrder: RequestHandler = (req, res, next) => {
  // let fetchedCart;
  // req.user
  //   ?.getCart()
  //   .then((cart) => {
  //     fetchedCart = cart;
  //     return cart.getItems();
  //   })
  //   .then((items) => {
  //     return req.user
  //       ?.createOrder()
  //       .then((order) => {
  //         order.addItems(items.map((item) => {
  //           item.orderItem = { quantity: item.cartItem.quantity }
  //           return item;
  //         }));
  //       })
  //       .catch((err) => console.log('createOrder Error:', err));
  //   })
  //   .then(() => fetchedCart.setItems([]))
  //   .then(() => res.redirect('/orders'))
  //   .catch((err) => console.log('postOrder Error:', err));
};

export { getItems, getItemById, getCart, postUpdateCart, getOrders, postCreateOrder };

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

const getCart: RequestHandler = (req, res, next) => {
  // req.user
  //   ?.getCart()
  //   .then((cart) => {
  //     return cart.getItems().then((items) => {
  //       res.render('body', {
  //            title: 'Your Cart',
  //         isActive: '/cart',
  //             view: 'cart',
  //           styles: ['cart'],
  //           locals: { items },
  //       });
  //     });
  //   })
  //   .catch((err) => console.log('getCart Error:', err));
};

const postAddToCart: RequestHandler = async (req, res, next) => {
  const { itemId } = req.body;

  try {
    if (req.user) {
      req.user.updateCart(itemId, 1);
      res.redirect('/cart');
    }
  } catch (error) {
    console.log('postAddToCart Error:', error);
  }
};

const postRemoveFromCart: RequestHandler = async (req, res, next) => {
  const { itemId } = req.body;

  try {
    if (req.user) {
      req.user.updateCart(itemId, -1);
      res.redirect('/cart');
    }
  } catch (error) {
    console.log('postRemoveFromCart Error:', error);
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

export { getItems, getItemById, getCart, postAddToCart, postRemoveFromCart, getOrders, postCreateOrder };

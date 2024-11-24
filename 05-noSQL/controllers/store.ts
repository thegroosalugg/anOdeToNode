import { RequestHandler } from 'express';
import Item from '../models/Item';
import Cart from '../models/Cart';
import html from '../views/index';
import {     cartCSS,  cartPage } from '../views/cartPage';
import { itemPageCSS,  itemPage } from '../views/itemPage';
import {  ordersCSS, ordersPage } from '../views/ordersPage';

const getItems: RequestHandler = (req, res, next) => {
  Item.findAll()
    .then((items) => {
      res.render('root', { title: 'Home', isActive: '/', view: 'homepage', locals: { items } });
    })
    .catch((err) => console.log('getItems Error:', err));
};

const getItemById: RequestHandler = (req, res, next) => {
  const { itemId } = req.params;
  Item.findByPk(+itemId).then((item) => {
    res.render('root', {
         title: item?.name || 'Not Found',
      isActive: '/',
          view: 'itempage',
        locals: { item },
    });
  });
};

const getCart: RequestHandler = (req, res, next) => {
  req.user
    ?.getCart()
    .then((cart) => {
      return cart.getItems().then((items) => {
        res.render('root', {
             title: 'Your Cart',
          isActive: '/cart',
              view: 'cart',
            locals: { items },
        });
      });
    })
    .catch((err) => console.log('getCart Error:', err));
};

const postAddToCart: RequestHandler = (req, res, next) => {
  const { itemId } = req.body;
  req.user?.getCart().then((cart) => {
    cart
      .getItems({ where: { id: itemId } })
      .then(([item]) => {
        if (item) {
          const quantity = item.cartItem.quantity + 1;
          item.cartItem.update({ quantity });
        } else {
          Item.findByPk(itemId).then((item) => {
            if (item) {
              cart.addItem(item, { through: { quantity: 1 } });
            }
          });
        }
      })
      .then(() => res.redirect('/cart'));
  });
};

const postRemoveFromCart: RequestHandler = (req, res, next) => {
  const { itemId } = req.body;
  req.user?.getCart().then((cart) => {
    cart
      .getItems({ where: { id: itemId } })
      .then(([item]) => {
        if (item) {
          const quantity = item.cartItem.quantity - 1;
          if (quantity === 0) {
            item.cartItem.destroy();
          } else {
            item.cartItem.update({ quantity });
          }
        }
      })
      .then(() => res.redirect('/cart'));
  });
}

const getOrders: RequestHandler = (req, res, next) => {
  req.user?.getOrders({include: ['items']}).then((orders) => {
    res.send(
      html({
             css: ordersCSS,
         content: ordersPage(orders),
           title: 'Your Orders',
        isActive: '/admin/items',
      })
    );
  });
};

const postCreateOrder: RequestHandler = (req, res, next) => {
  let fetchedCart: Cart;
  req.user
    ?.getCart()
    .then((cart) => {
      fetchedCart = cart;
      return cart.getItems();
    })
    .then((items) => {
      return req.user
        ?.createOrder()
        .then((order) => {
          order.addItems(items.map((item) => {
            item.orderItem = { quantity: item.cartItem.quantity }
            return item;
          }));
        })
        .catch((err) => console.log('createOrder Error:', err));
    })
    .then(() => fetchedCart.setItems([]))
    .then(() => res.redirect('/orders'))
    .catch((err) => console.log('postOrder Error:', err));
};

export { getItems, getItemById, getCart, postAddToCart, postRemoveFromCart, getOrders, postCreateOrder };

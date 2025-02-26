import { RequestHandler } from 'express';
import Item from '../models/Item';
import Cart from '../models/Cart';
import html from '../views/index';
import {    storeCSS, storePage } from '../views/storePage';
import {     cartCSS,  cartPage } from '../views/cartPage';
import { itemPageCSS,  itemPage } from '../views/itemPage';
import {  ordersCSS, ordersPage } from '../views/ordersPage';

const getItems: RequestHandler = (req, res, next) => {
  Item.findAll().then((items) => {
    res.send(
      html({ css: storeCSS, content: storePage({ items }), title: 'Mountain Store', isActive: '/' })
    );
  }).catch(err => console.log('getItems Error:', err));
};

const getItemById: RequestHandler = (req, res, next) => {
  const { itemId } = req.params;
  // sequelize crashes with strings, where as SQL will returned undefined
  Item.findByPk(+itemId || undefined).then((item) => {
    res.send(
      html({
             css: itemPageCSS,
         content: itemPage(item),
           title: item?.name || 'Page Not Found',
        isActive: '/',
      })
    );
  });
};

const getCart: RequestHandler = (req, res, next) => {
  req.user?.getCart().then((cart) => {
    return cart.getItems().then((items) => {
      res.send(
        html({
               css: cartCSS,
           content: cartPage(items),
             title: 'Your Cart',
          isActive: '/cart',
        })
      );
    })
  }).catch(err => console.log('getCart Error:', err));
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

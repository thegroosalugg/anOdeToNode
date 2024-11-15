import { RequestHandler } from 'express';
import Item from '../models/Item';
import Cart from '../models/Cart';
import html from '../views/index';
import {    storeCSS, storePage } from '../views/storePage';
import {     cartCSS,  cartPage } from '../views/cartPage';
import { itemPageCSS,  itemPage } from '../views/itemPage';

const getItems: RequestHandler = (req, res, next) => {
  Item.fetchAll((items) => {
    res.send(
      html({ css: storeCSS, content: storePage({ items }), title: 'Mountain Store', isActive: '/' })
    );
  });
};

const getItemById: RequestHandler = (req, res, next) => {
  const { itemId } = req.params;
  Item.findById(+itemId, (item) => {
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
  Cart.getItems((cart) => {
    Item.fetchAll((items) => {
      const cartItems = [] as (Omit<Item, 'save'> & { quantity: number })[];
                            // omits save function from new type and adds quantity
      for (const cartItem of cart) {
        const item = items.find((item) => item.id!.toString() === cartItem.id)
        if (item) {
          cartItems.push({ ...item, quantity: cartItem.quantity })
        }
      }
      res.send(
        html({
               css: cartCSS,
           content: cartPage(cartItems),
             title: 'Your Cart',
          isActive: '/cart',
        })
      );
    })
  })
};

const postAddToCart: RequestHandler = (req, res, next) => {
  const { itemId } = req.body;
  Item.findById(itemId, (item) => {
    if (item) {
      Cart.update(itemId, 1)
    }
  })
  res.redirect('/cart');
}

const postRemoveFromCart: RequestHandler = (req, res, next) => {
  const { itemId } = req.body;
  Cart.update(itemId, -1)
  res.redirect('/cart');
}

export { getItems, getItemById, getCart, postAddToCart, postRemoveFromCart };

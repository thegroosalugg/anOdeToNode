import { RequestHandler } from 'express';
import Item from '../models/Item';
import Cart from '../models/Cart';
import html from '../views/index';
import { storeCSS, store } from '../views/store';
import { itemPage, itemPageCSS } from '../views/itemPage';

const getItems: RequestHandler = (req, res, next) => {
  Item.fetchAll((items) => {
    res.send(
      html({ css: storeCSS, content: store(items), title: 'Mountain Store', isActive: '/' })
    );
  });
};

const getItemById: RequestHandler = (req, res, next) => {
  const { itemId } = req.params;
  Item.findById(itemId, (item) => {
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
  res.send(
    html({
      css: 'h1 { text-align: center; color: #000; font-size: 2rem; font-weight: 500 } ',
      content: '<h1>Cart</h1>',
      title: 'Your Cart',
      isActive: '/cart',
    })
  );
};

const postCart: RequestHandler = (req, res, next) => {
  const { itemId } = req.body;
  Item.findById(itemId, (item) => {
    if (item) {
      Cart.addItem(itemId, item.price)
    }
  })
  res.redirect('/cart');
}

export { getItems, getItemById, getCart, postCart };

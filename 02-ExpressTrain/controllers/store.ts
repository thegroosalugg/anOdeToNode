import { RequestHandler } from 'express';
import Item from '../models/Item';
import html from '../views/index';
import { storeCSS, store } from '../views/store';

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
    console.log(itemId, item);
  });
  res.redirect('/');
};

export { getItems, getItemById };

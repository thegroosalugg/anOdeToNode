import { RequestHandler } from 'express';
import Item from '../models/Item';
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

export { getItems, getItemById };

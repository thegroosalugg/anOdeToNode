import { RequestHandler } from 'express';
import Item from '../models/Item';
import html from '../views/index';
import { storeCSS, store } from '../views/store';

const getItems: RequestHandler = (req, res, next) => {
  const items = Item.fetchAll((items: Item[]) => {
    console.log(items); // *logData
    res.send(html({ css: storeCSS, content: store(items), title: 'Mountain Store', isActive: '/' }));
  });
};

export { getItems };

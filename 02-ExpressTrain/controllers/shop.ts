import { RequestHandler } from 'express';
import Item from '../models/Item';
import html from '../views/index';
import { shopCSS, shop } from '../views/shop';

const getItems: RequestHandler = (req, res, next) => {
  const items = Item.fetchAll((items: Item[]) => {
    console.log(items); // *logData
    res.send(html({ css: shopCSS, content: shop(items), title: 'Express Train', isActive: '/' }));
  });
};

export { getItems };

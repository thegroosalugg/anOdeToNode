import { RequestHandler } from 'express';
import Item from '../models/Item';
import html from '../views/index';
import { formCSS, form } from '../views/form';
import { storeCSS, store } from '../views/store';

// /admin/items
const getUserItems: RequestHandler = (req, res, next) => {
  const items = Item.fetchAll((items: Item[]) => {
    res.send(html({ css: storeCSS, content: store(items), title: 'My Listings', isActive: '/admin/items' }));
  });
};

// /admin/add-item
const getAddItem: RequestHandler = (req, res, next) => {
  res.send(html({ css: formCSS, content: form, title: 'New Listing', isActive: '/admin/add-item' }));
};

// /admin/add-item
const postAddItem: RequestHandler = (req, res, next) => {
  const trimBody = Object.fromEntries(
    Object.entries(req.body).map(([key, value]) => [key, (value as string).replace(/\s+/g, ' ')])
  );
  const { name, description, price } = trimBody;

  if (name && description && +price > 0) {
    const item = new Item(name, description, '/images/board_red_blue.png', +price);
    item.save();
    res.redirect('/');
  }
};

export { getUserItems, getAddItem, postAddItem };

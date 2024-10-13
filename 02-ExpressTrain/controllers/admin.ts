import { RequestHandler } from 'express';
import Item from '../models/Item';
import html from '../views/index';
import { formCSS, form } from '../views/form';

// /admin/add-item
const getAddItem: RequestHandler = (req, res, next) => {
  res.send(html({ css: formCSS, content: form, title: 'See Items', isActive: '/admin/add-item' }));
};

// /admin/add-item
const postAddItem: RequestHandler = (req, res, next) => {
  const name = req.body.name.trim();
  if (name) {
    const item = new Item(name, 'description', '/images/board_red_blue.png', 500);
    item.save();
    res.redirect('/');
  }
};

export { getAddItem, postAddItem };

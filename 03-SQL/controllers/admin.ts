import { RequestHandler } from 'express';
import Item from '../models/Item';
import html from '../views/index';
import { formCSS, form } from '../views/form';
import { storeCSS, storePage } from '../views/storePage';
import trimBody from '../util/trimBody';

// /admin/items
const getUserItems: RequestHandler = (req, res, next) => {
  Item.fetchAll((items: Item[]) => {
    res.send(
      html({
             css: storeCSS,
         content: storePage({ items, isAdmin: true }),
           title: 'My Listings',
        isActive: '/admin/items',
      })
    );
  });
};

// /admin/add-item
const getAddItem: RequestHandler = (req, res, next) => {
  res.send(html({ css: formCSS, content: form(), title: 'New Listing', isActive: '/admin/add-item' }));
};

// /admin/add-item
const postAddItem: RequestHandler = (req, res, next) => {
  const { name, description, price } = trimBody(req.body);

  if (name && description && +price > 0) {
    const item = new Item(name, description, '/images/board_red_blue.png', +price);
    item.save();
    res.redirect('/admin/items');
  }
};

// admin//edit-item/:itemId
const getEditItem: RequestHandler = (req, res, next) => {
  const { edit } = req.query
  if (edit === 'true') {
    const { itemId } = req.params;
    Item.findById(itemId, (item) => {
      res.send(html({ css: formCSS, content: form(item), title: 'Edit Listing', isActive: '/admin/items' }));
    })
  } else {
    res.redirect('/');
  }
}

// /admin//edit-item
const postEditItem: RequestHandler = (req, res, next) => {
  const { id, imgURL, ...updatedFields } = req.body;
  const { name, description, price } = trimBody(updatedFields);

  if (id && imgURL && name && description && +price > 0) {
    const item = new Item(name, description, imgURL, +price, id);
    item.save();
    res.redirect('/admin/items');
  }
}

// /admin//delete-item
const postDeleteItem: RequestHandler = (req, res, next) => {
  const { itemId } = req.body;
  Item.deleteItem(itemId);
  res.redirect('/admin/items')
}

export { getUserItems, getAddItem, postAddItem, getEditItem, postEditItem, postDeleteItem };

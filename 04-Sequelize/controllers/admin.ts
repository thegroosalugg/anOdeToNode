import { RequestHandler } from 'express';
import Item from '../models/Item';
import html from '../views/index';
import { formCSS, form } from '../views/form';
import { storeCSS, storePage } from '../views/storePage';
import trimBody from '../util/trimBody';

const images = ['four_awesome', 'green_orange', 'red_blue', 'sleek_black', 'tall.jpg', 'wide.jpg', 'yellow_purple', 'yellow_purple_2'];

const randomIMG = () => {
  const index = Math.floor(Math.random() * images.length);
  const image = images[index];

  return '/images/board_' + image + (image.endsWith('.jpg') ? '' : '.png');
};

// /admin/items
const getUserItems: RequestHandler = (req, res, next) => {
  Item.findAll().then((items) => {
    res.send(
      html({
             css: storeCSS,
         content: storePage({ items, isAdmin: true }),
           title: 'My Listings',
        isActive: '/admin/items',
      })
    );
  }).catch(err => console.log('getUserItems Error:', err));
};

// /admin/add-item
const getAddItem: RequestHandler = (req, res, next) => {
  res.send(html({ css: formCSS, content: form(), title: 'New Listing', isActive: '/admin/add-item' }));
};

// /admin/add-item
const postAddItem: RequestHandler = (req, res, next) => {
  const { name, description, price } = trimBody(req.body);

  if (name && description && +price > 0) {
    Item.create({ name, desc: description, imgURL: randomIMG(), price: +price });
    res.redirect('/admin/items');
  }
};

// admin//edit-item/:itemId
const getEditItem: RequestHandler = (req, res, next) => {
  const { edit } = req.query
  if (edit === 'true') {
    const { itemId } = req.params;
    Item.findByPk(+itemId).then(item => {
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
    const item = new Item(name, description, imgURL, +price, +id);
    item.save();
    res.redirect('/admin/items');
  }
}

// /admin//delete-item
const postDeleteItem: RequestHandler = (req, res, next) => {
  const { itemId } = req.body;
  Item.deleteItem(+itemId);
  res.redirect('/admin/items')
}

export { getUserItems, getAddItem, postAddItem, getEditItem, postEditItem, postDeleteItem };

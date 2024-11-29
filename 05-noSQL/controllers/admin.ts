import { RequestHandler } from 'express';
import User from '../models/User';
import Item from '../models/Item';
import trimBody from '../util/trimBody';

const images = ['four_awesome', 'green_orange', 'red_blue', 'sleek_black', 'tall.jpg', 'wide.jpg', 'yellow_purple', 'yellow_purple_2'];

const randomIMG = () => {
  const index = Math.floor(Math.random() * images.length);
  const image = images[index];

  return '/images/board_' + image + (image.endsWith('.jpg') ? '' : '.png');
};

// /admin/items
const getUserItems: RequestHandler = async (req, res, next) => {
  if (req.user) {
    try {
      const items = await Item.fetchAll();
      res.render('body', {
           title: 'Dashboard',
        isActive: '/admin/items',
            view: 'itemsAll',
          styles: ['itemsAll', 'userNav'],
          locals: { items, isAdmin: true },
      });
    } catch (error) {
      console.log('getUserItems Error:', error);
    }
  } else {
    res.redirect('/');
  }
};

// /admin/add-item
const getAddItem: RequestHandler = (req, res, next) => {
  res.render('body', {
       title: 'New Listing',
    isActive: '/admin/items',
        view: 'form',
      styles: ['form', 'userNav'],
      locals: { item: null }
  });
};

// /admin/add-item
const postAddItem: RequestHandler = async (req, res, next) => {
  const { name, desc, price: str } = trimBody(req.body);
  const price = +str;

  if (name && desc && price > 0) {
    const item = new Item(name, desc, randomIMG(), price);
    try {
      await item.save();
      res.redirect('/admin/items');
    } catch (err) {
      console.log('postAddItem error:', err);
    }
  }
};

// admin/edit-item/:itemId
const getEditItem: RequestHandler = (req, res, next) => {
  const { edit } = req.query
  if (edit === 'true') {
    const { itemId } = req.params;
    req.user?.getItems({ where: { id: +itemId }}).then(( [item] ) => {
      res.render('body', {
           title: 'Edit Listing',
        isActive: '/admin/items',
            view: 'form',
          styles: ['form', 'userNav'],
          locals: { item }
      });
    })
  } else {
    res.redirect('/');
  }
}

// /admin//edit-item
const postEditItem: RequestHandler = (req, res, next) => {
  const { id, imgURL, ...updatedFields } = req.body;
  const { name, desc, price: str } = trimBody(updatedFields);
  const price = +str;

  if (req.user && id && imgURL && name && desc && price > 0) {
    req.user.getItems({ where: { id }})
      .then(([item]) => {
        if (item) {
          item.update({ name, desc, price });
          res.redirect('/admin/items');
        }
      })
      .catch((err) => console.log('PostEditItem Error:', err));
  } else {
    res.redirect('/');
  }
};

// /admin//delete-item
const postDeleteItem: RequestHandler = (req, res, next) => {
  req.user
    ?.getItems({ where: { id: +req.body.itemId } })
    .then((items) => {
      if (items.length > 0) {
        items[0].destroy();
      }
      res.redirect('/admin/items');
    })
    .catch((err) => console.log('Delete error:', err));
};

export { getUserItems, getAddItem, postAddItem, getEditItem, postEditItem, postDeleteItem };

import { RequestHandler } from 'express';
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
      const items = await Item.find({ userId: req.user._id });
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

  if (req.user && name && desc && price > 0) {
    const userId = req.user._id;
    const item = new Item({ name, desc, imgURL: randomIMG(), price, userId });

    try {
      await item.save();
      res.redirect('/admin/items');
    } catch (error) {
      console.log('postAddItem error:', error);
    }

  } else {
    res.redirect('/admin/add-item');
  }
};

// admin/edit-item/:itemId
const getEditItem: RequestHandler = async (req, res, next) => {
  const { edit } = req.query;
  if (edit === 'true') {
    const { itemId } = req.params;

    try {
      const item = await Item.findById(itemId);
      if (item) {
        res.render('body', {
             title: 'Edit Listing',
          isActive: '/admin/items',
              view: 'form',
            styles: ['form', 'userNav'],
            locals: { item },
        });
      } else {
        res.redirect('/');
      }
    } catch (error) {
      console.log('getEditItem error:', error);
    }

  } else {
    res.redirect('/');
  }
};

// /admin/edit-item
const postEditItem: RequestHandler = async (req, res, next) => {
  const { _id, imgURL, ...updatedFields } = req.body;
  const { name, desc, price: str } = trimBody(updatedFields);
  const price = +str;

  if (req.user && _id && imgURL && name && desc && price > 0) {
    try {
      await Item.updateOne({ _id }, { $set: { name, desc, imgURL, price }});
      res.redirect('/admin/items');
    } catch (error) {
      console.log('postEditItem error:', error);
    }

  } else {
    res.redirect('/admin/edit-item/' + _id + '/?edit=true');
  }
};

// /admin//delete-item
const postDeleteItem: RequestHandler = async (req, res, next) => {
  if (req.user) {
    const { itemId } = req.body;

    try {
      await Item.deleteOne({ _id: itemId });
      res.redirect('/admin/items');
    } catch (error) {
      console.log('postDeleteItem error:', error);
    }

  } else {
    res.redirect('/');
  }
};

export { getUserItems, getAddItem, postAddItem, getEditItem, postEditItem, postDeleteItem };

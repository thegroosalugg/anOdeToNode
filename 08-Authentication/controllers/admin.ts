import { RequestHandler } from 'express';
import Item from '../models/Item';
import trimBody from '../util/trimBody';
import errorMsg from '../util/errorMsg';
import { MongooseErrors, translateError } from '../util/translateError';

const images = ['four_awesome', 'green_orange', 'red_blue', 'sleek_black', 'tall.jpg', 'wide.jpg', 'yellow_purple', 'yellow_purple_2'];

const randomIMG = () => {
  const index = Math.floor(Math.random() * images.length);
  const image = images[index];

  return '/images/board_' + image + (image.endsWith('.jpg') ? '' : '.png');
};

// /admin/items - prepended by authenticate middleware
const getUserItems: RequestHandler = async (req, res, next) => {
  try {
    const items = await Item.find({ userId: req.user?._id });
    res.render('body', {
         title: 'Dashboard',
      isActive: '/admin/items',
          view: 'itemList',
        styles: ['itemList', 'dashboard', 'userInfo'],
        locals: { items, isAdmin: true },
    });
  } catch (error) {
    errorMsg({ error, where: 'getUserItems' });
    res.redirect('/');
  }
};

// /admin/add-item - prepended by authenticate middleware
const getAddItem: RequestHandler = (req, res, next) => {
  res.render('body', {
       title: 'New Listing',
    isActive: '/admin/items',
        view: 'itemForm',
      styles: ['itemForm', 'dashboard'],
      locals: { item: null },
  });
};

// /admin/add-item - prepended by authenticate middleware
const postAddItem: RequestHandler = async (req, res, next) => {
  const { name, desc, price } = trimBody(req.body);

  try {
    const userId = req.user; // mongoose will extract just the Id due to schema ref
    const item = new Item({ name, desc, imgURL: randomIMG(), price, userId });
    await item.save();
    res.redirect('/admin/items');
  } catch (error) {
    req.session.errors = translateError(error as MongooseErrors);
    errorMsg({ error, where: 'postAddItem' });
    res.redirect('/admin/add-item');
  }
};

// admin/edit-item/:itemId - prepended by authenticate middleware
const getEditItem: RequestHandler = async (req, res, next) => {
  const { edit } = req.query;

  if (edit !== 'true') {
    return res.redirect('/login');
  }

  try {
    const { itemId } = req.params;
    const item = await Item.findById(itemId);
    if (item) {
      res.render('body', {
           title: 'Edit Listing',
        isActive: '/admin/items',
            view: 'itemForm',
          styles: ['itemForm', 'dashboard'],
          locals: { item },
      });
    } else {
      res.redirect('/');
    }
  } catch (error) {
    errorMsg({ error, where: 'getEditItem' });
    res.redirect('/');
  }
};

// /admin/edit-item - prepended by authenticate middleware
const postEditItem: RequestHandler = async (req, res, next) => {
  const { _id, imgURL, ...updatedFields } = req.body;
  const { name, desc, price } = trimBody(updatedFields);

  try {
    await Item.updateOne(
      { _id },
      { $set: { name, desc, imgURL, price } },
      { runValidators: true } // ensures schema validations apply on updateOne
    );
    res.redirect('/admin/items');
  } catch (error) {
    req.session.errors = translateError(error as MongooseErrors);
    errorMsg({ error, where: 'postEditItem' });
    res.redirect('/admin/edit-item/' + _id + '/?edit=true');
  }
};

// /admin//delete-item - prepended by authenticate middleware
const postDeleteItem: RequestHandler = async (req, res, next) => {
  const { itemId } = req.body;
  try {
    await Item.deleteOne({ _id: itemId });
    res.redirect('/admin/items');
  } catch (error) {
    errorMsg({ error, where: 'postDeleteItem' });
    res.redirect('/');
  }
};

export { getUserItems, getAddItem, postAddItem, getEditItem, postEditItem, postDeleteItem };

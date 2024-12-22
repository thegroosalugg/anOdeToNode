import { RequestHandler } from 'express';
import Item from '../models/Item';
import trimBody from '../util/trimBody';
import errorMsg from '../util/errorMsg';
import { MongooseErrors, mongooseErrors } from '../validation/mongooseErrors';
import { getErrors, hasErrors } from '../validation/validators';

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

// /admin/item-form - prepended by authenticate middleware
const getItemForm: RequestHandler = async (req, res, next) => {
  const { itemId } = req.params;
  let item = null;

  if (itemId) {
    try {
      item = await Item.findOne({ _id: itemId, userId: req.user?._id });
    } catch (error) {
      errorMsg({ error, where: 'getEditItem' });
      return res.redirect('/login');
    }
  }

  res.render('body', {
       title: 'New Listing',
    isActive: '/admin/items',
        view: 'itemForm',
      styles: ['itemForm', 'dashboard'],
      locals: { item },
  });
};

// /admin/add-item - prepended by authenticate middleware
const postAddItem: RequestHandler = async (req, res, next) => {
  const { name, desc, price } = trimBody(req.body);
  const image = req.file;

  if (!image) {
    errorMsg({ error: 'NO IMAGE', where: 'postAddItem' });
    req.session.errors = { image: 'must be .jpg, .jpeg or .png' };
    req.session.formData = { name, desc, price };
    req.session.save(() => res.redirect('/admin/item-form'));
    return;
  }

  const errors = getErrors(req);
  if (hasErrors(errors)) {
    errorMsg({ error: errors, where: 'postAddItem' });
    req.session.errors = errors;
    req.session.formData = { name, desc, price };
    req.session.save(() => res.redirect('/admin/item-form'));
    return;
  }

  try {
    const userId = req.user; // mongoose will extract just the Id due to schema ref
    const item = new Item({ name, desc, imgURL: image.path, price, userId });
    await item.save();
    res.redirect('/admin/items');
  } catch (error) {
    errorMsg({ error, where: 'postAddItem' });
    req.session.errors = mongooseErrors(error as MongooseErrors);
    req.session.save(() => res.redirect('/admin/item-form'));
  }
};


// /admin/edit-item - prepended by authenticate middleware
const postEditItem: RequestHandler = async (req, res, next) => {
  const { _id, ...updatedFields } = req.body;
  const { name, desc, price } = trimBody(updatedFields);
  const image = req.file;

  const errors = getErrors(req);
  if (hasErrors(errors)) {
    errorMsg({ error: errors, where: 'postEditItem' });
    req.session.errors = errors;
    req.session.formData = { name, desc, price };
    req.session.save(() => res.redirect('/admin/item-form/' + _id));
    return;
  }

  try {
    const updatedData: Record<string, string> = { name, desc, price };
    if (image) updatedData.imgURL = image.path;
    await Item.updateOne(
      { _id, userId: req.user?._id },
      { $set: updatedData },
      { runValidators: true } // ensures schema validations apply on updateOne
    );
    res.redirect('/admin/items');
  } catch (error) {
    errorMsg({ error, where: 'postEditItem' });
    req.session.errors = mongooseErrors(error as MongooseErrors);
    req.session.save(() => res.redirect('/admin/item-form/' + _id));
  }
};

// /admin//delete-item - prepended by authenticate middleware
const postDeleteItem: RequestHandler = async (req, res, next) => {
  const { itemId } = req.body;
  try {
    await Item.deleteOne({ _id: itemId, userId: req.user?._id });
    res.redirect('/admin/items');
  } catch (error) {
    errorMsg({ error, where: 'postDeleteItem' });
    res.redirect('/');
  }
};

export { getUserItems, getItemForm, postAddItem, postEditItem, postDeleteItem };

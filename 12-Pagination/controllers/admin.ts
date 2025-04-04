import { RequestHandler } from 'express';
import Item from '../models/Item';
import trimBody from '../util/trimBody';
import errorMsg from '../util/errorMsg';
import { MongooseErrors, mongooseErrors } from '../validation/mongooseErrors';
import { getErrors, hasErrors } from '../validation/validators';
import { deleteFile, updateFile } from '../util/fileHelper';

// /admin/items - prepended by authenticate middleware
const getUserItems: RequestHandler = async (req, res, next) => {
  const page = +(req.query.page || 1);
  const docsPerPage = 2;
  const userId = req.user?._id

  try {
    const docCount = await Item.find({ userId }).countDocuments();
    const items     = await Item.find({ userId })
      .skip((page - 1) * docsPerPage)
      .limit(docsPerPage);

    const pagination = { active: page, docsPerPage, docCount };

    res.render('body', {
         title: 'Dashboard',
      isActive: '/admin/items',
          view: 'itemList',
        styles: ['itemList', 'dashboard', 'userInfo', 'pagination'],
        locals: { items, isAdmin: true, pagination },
    });
  } catch (error) {
    errorMsg({ error, where: 'getUserItems' });
    res.redirect('/');
  }
};

// /admin/item-form - prepended by authenticate middleware
const getItemForm: RequestHandler = async (req, res, next) => {
  const { itemId } = req.params;
  const filename   = req.session.file?.originalname;
  let item = null;
  req.session.dataRoute = true;

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
      locals: { item, filename },
  });
};

// /admin/add-item - prepended by authenticate middleware
const postAddItem: RequestHandler = async (req, res, next) => {
  const { name, desc, price } = trimBody(req.body);
  const image = req.file || req.session.file;

  const errors = getErrors(req);
  if (hasErrors(errors) || !image) {
    errorMsg({ error: errors, where: 'postAddItem' });
    req.session.errors = errors;
    req.session.formData = { name, desc, price };
    if (image) {
      req.session.file      = image;
      req.session.dataRoute = true;
    } else {
      req.session.errors.image = 'must be .jpg, .jpeg or .png';
    }
    req.session.save(() => res.redirect('/admin/item-form'));
    return;
  }

  try {
    const imgURL = updateFile(image.path, image.filename);
    const userId = req.user; // mongoose will extract just the Id due to schema ref
    const item = new Item({ name, desc, imgURL, price, userId });
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
  const image = req.file || req.session.file;

  const errors = getErrors(req);
  if (hasErrors(errors)) {
    errorMsg({ error: errors, where: 'postEditItem' });
    req.session.errors = errors;
    req.session.formData = { name, desc, price };
    if (image) {
      req.session.file      = image;
      req.session.dataRoute = true;
    }
    if (req.fileError) req.session.errors.image = req.fileError;
    req.session.save(() => res.redirect('/admin/item-form/' + _id));
    return;
  }

  try {
    const item = await Item.findOne({ _id, userId: req.user?._id });
    if (item) {
      Object.assign(item, { name, price, desc });
      if (image) {
        const imgURL = updateFile(image.path, image.filename);
        deleteFile(item.imgURL);
        item.imgURL = imgURL;
      }
      await item.save();
    }
    res.redirect('/admin/items');
  } catch (error) {
    errorMsg({ error, where: 'postEditItem' });
    req.session.errors = mongooseErrors(error as MongooseErrors);
    req.session.save(() => res.redirect('/admin/item-form/' + _id));
  }
};

// /admin/item/:itemId - prepended by authenticate middleware
const deleteItem: RequestHandler = async (req, res, next) => {
  const { itemId: _id } = req.params;
  try {
    const item = await Item.findOne({ _id, userId: req.user?._id });
    if (item) {
      deleteFile(item.imgURL);
      await Item.deleteOne({ _id });
    }
    res.status(200).json({ message: 'Deletion Success' });
  } catch (error) {
    errorMsg({ error, where: 'postDeleteItem' });
    res.status(500).json({ message: 'Deletion Failed' });
  }
};

export { getUserItems, getItemForm, postAddItem, postEditItem, deleteItem };

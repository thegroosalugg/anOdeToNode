import { RequestHandler } from 'express';
import Item from '../models/Item';
import AppError from '../models/Error';
import trimBody from '../util/trimBody';
import { getErrors, hasErrors } from '../validation/validators';
import { deleteFile } from '../util/fileHelper';
import { renameSync } from 'fs';
import { join } from 'path';

// /admin/items - prepended by authenticate middleware
const getUserItems: RequestHandler = async (req, res, next) => {
  const page = +(req.query.page || 1);
  const docsPerPage = 4;
  const userId = req.user?._id

  try {
    const docCount = await Item.find({ userId }).countDocuments();
    const items    = await Item.find({ userId })
      .skip((page - 1) * docsPerPage)
      .limit(docsPerPage)
      .sort({ updatedAt: -1 });

    const pagination = { active: page, docsPerPage, docCount };

    res.render('body', {
           title: 'Dashboard',
       activeNav: '/admin/items',
      activeDash: 'items',
            view:  'store/list',
          styles: ['store/list', 'user/details', 'includes/dashboard', 'includes/pagination'],
          locals: { items, isAdmin: true, pagination },
    });
  } catch (error) {
    return next(new AppError(404, error));
  }
};

// /admin/form - prepended by authenticate middleware
const getItemForm: RequestHandler = async (req, res, next) => {
  const { itemId } = req.params;
  const filename   = req.session.file?.originalname;
  let item = null;
  req.session.dataRoute = true;

  if (itemId) {
    try {
      item = await Item.findOne({ _id: itemId, userId: req.user?._id });
    } catch (error) {
      return next(new AppError(500, error));
    }
  }

  res.render('body', {
         title: 'New Listing',
     activeNav: '/admin/items',
    activeDash: 'form',
          view:  'user/listing',
        styles: ['user/listing', 'includes/dashboard'],
        locals: { item, filename },
  });
};

// /admin/add-item - prepended by authenticate middleware
const postAddItem: RequestHandler = async (req, res, next) => {
  const { name, desc, price } = trimBody(req.body);
  const image = req.file || req.session.file;

  const errors = getErrors(req);
  if (hasErrors(errors) || !image) {
    req.session.errors = errors;
    req.session.formData = { name, desc, price };
    if (image) {
      req.session.file      = image;
      req.session.dataRoute = true;
    } else {
      req.session.errors.image = 'must be .jpg, .jpeg or .png';
    }
    req.session.save(() => next(new AppError(422, errors, '/admin/form')));
    return;
  }

  try {
    const userId = req.user; // mongoose will extract just the Id due to schema ref
    const imgURL = join('uploads', image.filename); // remove 'temp' from filepath
    const item = new Item({ name, desc, imgURL, price, userId });
    await item.save();
    renameSync(image.path, imgURL); // move file after mongoose schema validation
    res.redirect('/admin/items');
  } catch (error) {
    return next(new AppError(500, error));
  }
};

// /admin/edit-item - prepended by authenticate middleware
const postEditItem: RequestHandler = async (req, res, next) => {
  const { _id, ...updatedFields } = req.body;
  const { name, desc, price } = trimBody(updatedFields);
  const image = req.file || req.session.file;

  const errors = getErrors(req);
  if (hasErrors(errors)) {
    req.session.errors = errors;
    req.session.formData = { name, desc, price };
    if (image) {
      req.session.file = image;
      req.session.dataRoute = true;
    }
    if (req.fileError) req.session.errors.image = req.fileError; // fileError: set by Multer middleware
    req.session.save(() => next(new AppError(422, errors, `/admin/form/${_id}`)));
    return;
  }

  try {
    const item = await Item.findOne({ _id, userId: req.user?._id });
    if (!item) return next(new AppError(404, 'item not found', '/admin/items'));

    let oldImgUrl = '';
    let newImgUrl = '';

    Object.assign(item, { name, price, desc });

    if (image) {
      oldImgUrl = item.imgURL
      newImgUrl = join('uploads', image.filename);
      item.imgURL = newImgUrl;
    }

    await item.save();
    if (image) {
      deleteFile(oldImgUrl);
      renameSync(image.path, newImgUrl);
    }
    res.redirect('/admin/items');
  } catch (error) {
    return next(new AppError(500, error));
  }
};

// /admin/item/:itemId - prepended by authenticate middleware
const deleteItem: RequestHandler = async (req, res, next) => {
  const { itemId: _id } = req.params;
  try {
    const item = await Item.findOne({ _id, userId: req.user?._id });
    if (!item) {
      res.status(404).json({ message: 'Item not found' });
      return
    }
    deleteFile(item.imgURL);
    await Item.deleteOne({ _id });
    res.status(200).json({ message: 'Deletion Success' });
  } catch (error) {
    return next(new AppError(500, error));
  }
};

export { getUserItems, getItemForm, postAddItem, postEditItem, deleteItem };

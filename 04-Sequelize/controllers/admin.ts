import { RequestHandler } from 'express';
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
  if (req.user) {
    req.user
      .getItems()
      .then((items) => {
        res.send(
          html({
                 css: storeCSS,
             content: storePage({ items, isAdmin: true }),
               title: 'My Listings',
            isActive: '/admin/items',
          })
        );
      })
      .catch((err) => console.log('getUserItems Error:', err));
  } else {
    res.redirect('/');
  }
};

// /admin/add-item
const getAddItem: RequestHandler = (req, res, next) => {
  res.send(html({ css: formCSS, content: form(), title: 'New Listing', isActive: '/admin/add-item' }));
};

// /admin/add-item
const postAddItem: RequestHandler = (req, res, next) => {
  const { name, description: desc, price: str } = trimBody(req.body);
  const price = +str;

  if (req.user && name && desc && price > 0) {
    req.user
      .createItem({ name, desc, imgURL: randomIMG(), price })
      .then(() => res.redirect('/admin/items'))
      .catch((err) => console.log('postAddItem error:', err));
  }
};

// admin//edit-item/:itemId
const getEditItem: RequestHandler = (req, res, next) => {
  const { edit } = req.query
  if (edit === 'true') {
    const { itemId } = req.params;
    req.user?.getItems({ where: { id: +itemId }}).then(items => {
      res.send(html({ css: formCSS, content: form(items[0]), title: 'Edit Listing', isActive: '/admin/items' }));
    })
  } else {
    res.redirect('/');
  }
}

// /admin//edit-item
const postEditItem: RequestHandler = (req, res, next) => {
  const { id, imgURL, ...updatedFields } = req.body;
  const { name, description: desc, price: str } = trimBody(updatedFields);
  const price = +str;

  if (req.user && id && imgURL && name.trim() && desc.trim() && price > 0) {
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

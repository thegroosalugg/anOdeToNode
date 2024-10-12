import { RequestHandler } from 'express';
import Card from '../models/Card';
import html from '../views/index';
import { formCSS, form } from '../views/form';
import { homeCSS, home } from '../views/home';

const getCards: RequestHandler = (req, res, next) => {
  const cards = Card.fetchAll((cards: Card[]) => {
    console.log(cards); // *logData
    res.send(html({ css: homeCSS, content: home(cards), title: 'Express Train', isActive: '/' }));
  });
};

// /admin/card
const getAddCard: RequestHandler = (req, res, next) => {
  res.send(html({ css: formCSS, content: form, title: 'See Card', isActive: '/add-card' }));
};

// /admin/add-card
const postAddCard: RequestHandler = (req, res, next) => {
  const name = req.body.name.trim();
  if (name) {
    const station = new Card(name, 'description', 'image', 1);
    station.save();
    res.redirect('/');
  }
};

export { getCards, getAddCard, postAddCard };

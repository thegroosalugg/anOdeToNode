import { RequestHandler } from 'express';
import html from '../views';
import { errorPage, errorCSS } from '../views/errorPage';

const errorController: RequestHandler = (req, res, next) => {
  res.status(404).send(html({ css: errorCSS, content: errorPage, title: '404' }));
};

export default errorController;

import { RequestHandler } from 'express';
import html from '../views';
import { error, errorCSS } from '../views/error';

const errorController: RequestHandler = (req, res, next) => {
  res.status(404).send(html({ css: errorCSS, content: error, title: '404' }));
};

export default errorController;

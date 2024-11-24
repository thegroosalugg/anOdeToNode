import { RequestHandler } from 'express';

const errorController: RequestHandler = (req, res, next) => {
  res.render('body', {
       title: 'Not Found',
         css: '404',
    isActive: '',
        view: '404'
  });
};

export default errorController;

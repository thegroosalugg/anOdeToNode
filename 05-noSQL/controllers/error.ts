import { RequestHandler } from 'express';

const errorController: RequestHandler = (req, res, next) => {
  res.render('body', {
       title: 'Not Found',
    isActive: '',
        view: '404',
      styles: ['404'],
  });
};

export default errorController;

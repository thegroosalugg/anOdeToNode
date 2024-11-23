import { RequestHandler } from 'express';

const errorController: RequestHandler = (req, res, next) => {
  res.render('root', {
       title: 'Not Found',
    isActive: '',
        view: '404'
  });
};

export default errorController;

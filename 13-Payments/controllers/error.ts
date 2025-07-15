import { RequestHandler } from 'express';

const error404: RequestHandler = (req, res, next) => {
  res.status(404).render('body', {
        title: 'Not Found',
    activeNav: '',
         view: 'boundary/error',
       styles: ['boundary/error'],
       locals: { error: '404' }
  });
};

const error500: RequestHandler = (req, res, next) => {
  res.status(500).render('body', {
        title: 'Server Error',
    activeNav: '',
         view: 'boundary/error',
       styles: ['boundary/error'],
       locals: { error: '500' }
  });
};


export { error404, error500 };

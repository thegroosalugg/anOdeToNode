import { RequestHandler } from 'express';

export const errorPage: RequestHandler = (req, res, next) => {
  let status = 404;
  let  title = 'Not found'

  if (req.path === '/500') {
    status = 500;
     title = 'Server Error';
  }

  res.status(status).render('body', {
        title,
    activeNav: '',
         view: 'boundary/error',
       styles: ['boundary/error'],
       locals: { status }
  });
};

export default errorPage;

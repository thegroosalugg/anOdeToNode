import { RequestHandler } from 'express';
import User from '../models/User';

const getLogin: RequestHandler = async (req, res, next) => {
  console.log(req.session);
  res.render('body', {
       title: 'Login',
    isActive: '/login',
        view: 'login',
      styles: ['login'],
      locals: {},
  })
};

const postLogin: RequestHandler = async (req, res, next) => {
  const user = await User.findById('6750df45541bb5fbb4115baf');
  req.session.user = user;
  res.redirect('/');
};

const postLogout: RequestHandler = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      console.log('postLogout destroy session error:', err);
    }

    // Clear user data from req and res locals
    req.user = null;
    res.locals.user = null;

    res.redirect('/');
  });
};

export { getLogin, postLogin, postLogout };

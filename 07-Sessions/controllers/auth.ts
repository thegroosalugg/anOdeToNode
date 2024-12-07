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

export { getLogin, postLogin };

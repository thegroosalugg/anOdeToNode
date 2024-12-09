import { RequestHandler } from 'express';
import User from '../models/User';
import errorMsg from '../util/errorMsg';

const getLogin: RequestHandler = (req, res, next) => {
  if (!req.user) {
    const { newuser } = req.query;
    const signup = newuser === 'true';
    const title = signup ? 'Sign Up' : 'Login';

    res.render('body', {
         title,
      isActive: '/login',
          view: 'login',
        styles: ['login'],
        locals: { signup },
    })
  } else {
    res.redirect('/admin/items')
  }
};

const postLogin: RequestHandler = async (req, res, next) => {
  const user = await User.findById('6750df45541bb5fbb4115baf');
  req.session.user = user;
  res.redirect('/admin/items');
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

const postSignup: RequestHandler = async (req, res, next) => {
  errorMsg({ error: '', msg: 'signup' })
  res.redirect('/login');
};

export { getLogin, postLogin, postLogout, postSignup };

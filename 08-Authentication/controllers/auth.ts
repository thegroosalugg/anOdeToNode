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
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user && user.password === password) {
      req.session.user = user;
      res.redirect('/admin/items');
    } else {
      errorMsg({ error: 'email/password is wrong', msg: 'postLogin', })
      res.redirect('/login');
    }
  } catch (error) {
    errorMsg({ error, msg: 'postLogin' });
    res.redirect('/login');
  }
};

const postLogout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      errorMsg({ error, msg: 'postLogout'});
    }
    res.redirect('/');
  });
};

const postSignup: RequestHandler = async (req, res, next) => {
  const { name, email, password, confirm_password } = req.body;

  if (password !== confirm_password) {
    errorMsg({ error: 'password don\'t match', msg: 'postSignup' });
    return res.redirect('/login/?newuser=true');
  }

  try {
    const user = new User({ name, email, password });
    await user.save();
    req.session.user = user;
    res.redirect('/admin/items');
  } catch (error) {
    // will catch duplicate emails & all empty fields
    errorMsg({ error, msg: 'postSignup' });
    res.redirect('/login/?newuser=true');
  }
};

export { getLogin, postLogin, postLogout, postSignup };

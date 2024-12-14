import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import errorMsg from '../util/errorMsg';
import { MongooseErrors, translateError } from '../util/translateError';

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
    res.redirect('/admin/items');
  }
};

const postLogin: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        req.session.user = user;
        res.redirect('/admin/items');
      } else {
        req.session.errors = { password: 'is incorrect' };
        errorMsg({ error: "password doesn't match", where: 'postLogin' });
        res.redirect('/login');
      }
    } else {
      req.session.errors = { email: 'is incorrect' };
      errorMsg({ error: 'email not matched to a user', where: 'postLogin' });
      res.redirect('/login');
    }
  } catch (error) {
    errorMsg({ error, where: 'postLogin' });
    res.redirect('/login');
  }
};

const postLogout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) {
      errorMsg({ error, where: 'postLogout' });
    }
    res.redirect('/');
  });
};

const postSignup: RequestHandler = async (req, res, next) => {
  const { name, email, password, confirm_password } = req.body;

  if (!password.trim() || !confirm_password.trim() || password !== confirm_password) {
    const error = password.trim() !== confirm_password.trim() ? "doesn't match" : 'required';
    req.session.errors = { password: error };
    errorMsg({ error, where: 'postSignup' });
    return res.redirect('/login/?newuser=true');
  }

  try {
    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashed });
    await user.save();
    req.session.user = user;
    res.redirect('/admin/items');
  } catch (error) {
    // will catch duplicate emails & all empty fields
    req.session.errors = translateError(error as MongooseErrors);
    errorMsg({ error, where: 'postSignup' });
    res.redirect('/login/?newuser=true');
  }
};

export { getLogin, postLogin, postLogout, postSignup };

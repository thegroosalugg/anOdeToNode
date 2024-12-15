import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import errorMsg from '../util/errorMsg';
import { MongooseErrors, translateError } from '../util/translateError';
import { sendMail } from '../util/sendmail';

const getLogin: RequestHandler = (req, res, next) => {
  if (!req.user) {
    const { newuser, resetpass } = req.query;
    const signup =   newuser === 'true';
    const  reset = resetpass === 'true';
    const title  = signup ? 'Sign Up' : reset ? 'Password Reset' : 'Login';

    res.render('body', {
         title,
      isActive: '/login',
          view: 'login',
        styles: ['login'],
        locals: { signup, reset },
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
        req.session.save(() => res.redirect('/admin/items'));
      } else {
        errorMsg({ error: "wrong password", where: 'postLogin' });
        req.session.errors = { password: 'is incorrect' };
        req.session.save(() => res.redirect('/login'));
      }
    } else {
      errorMsg({ error: 'email not matched to a user', where: 'postLogin' });
      req.session.errors = { email: 'is incorrect' };
      req.session.save(() => res.redirect('/login'));
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
    errorMsg({ error, where: 'postSignup' });
    req.session.errors = { password: error };
    req.session.save(() => res.redirect('/login/?newuser=true'));
    return;
  }

  try {
    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ name, email, password: hashed });
    await user.save();
    req.session.user = user;
    res.redirect('/admin/items');
  } catch (error) {
    // will catch duplicate emails & all empty fields
    errorMsg({ error, where: 'postSignup' });
    req.session.errors = translateError(error as MongooseErrors);
    req.session.save(() => res.redirect('/login/?newuser=true'));
  }
};

const postReset: RequestHandler =  (req, res, next) => {
  const { email } = req.body;
  console.log(email);
  res.redirect('/login');
}

export { getLogin, postLogin, postLogout, postSignup, postReset };

import { RequestHandler } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import AppError from '../models/Error';
import { MongooseErrors, mongooseErrors } from '../validation/mongooseErrors';
// import { sendMail } from '../util/sendmail';
import { getErrors, hasErrors } from '../validation/validators';
import logger from '../util/logger';

const getLogin: RequestHandler = async (req, res, next) => {
  if (req.user) return res.redirect('/admin/items');

  const { signup, reset, token } = req.query;
  let state: keyof typeof titles = 'login';

  const titles = {
       login: 'Login',
      signup: 'Sign Up',
       reset: 'Reset Password',
    password: 'Set New Password',
  };


  try {
    if (token) {
      const user = await User.findOne({
         'resetAuth.token': token,
        'resetAuth.expiry': { $gt: Date.now() } // Check if the token has not expired
      });

      if (user) {
        state = 'password'; // if user is found via token, then expiry WILL exist too!
        req.session.resetAuth = { token, expiry: user.resetAuth!.expiry, userId: user._id };
      }
    }

    if (signup === 'true') state = 'signup';
    if (reset  === 'true') state = 'reset';

    res.render('body', {
          title: titles[state],
      activeNav: '/login',
           view:  'user/login',
         styles: ['user/login'],
         locals: { state },
    });
  } catch (error) {
    return next(new AppError(500, error));
  }
};

const postLogin: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.session.errors   = { email: 'is incorrect' };
      req.session.formData = { email };
      req.session.save(() => next(new AppError(401, 'email not matched to a user', '/login')));
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      req.session.errors   = { password: 'is incorrect' };
      req.session.formData = { email };
      req.session.save(() => next(new AppError(401, 'wrong password', '/login')));
      return;
    }

    req.session.user = user;
    req.session.save(() => res.redirect('/admin/items'));
  } catch (error) {
    return next(new AppError(500, error));
  }
};

const postLogout: RequestHandler = (req, res, next) => {
  req.session.destroy((error) => {
    if (error) logger(500, { logout: error });
    res.redirect('/login');
  });
};

const postSignup: RequestHandler = async (req, res, next) => {
  const { name, email, password } = req.body;
  const redirect = '/login/?signup=true';

  const errors = getErrors(req);
  if (hasErrors(errors)) {
    req.session.errors   = errors;
    req.session.formData = { name, email };
    req.session.save(() => next(new AppError(422, errors, redirect)));
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
    req.session.formData = { name, email };
    req.session.errors = mongooseErrors(error as MongooseErrors);
    req.session.save(() => next(new AppError(422, error, redirect)));
  }
};

const postReset: RequestHandler = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      req.session.errors   = { email: 'invalid' };
      req.session.formData = { email };
      req.session.save(() => next(new AppError(401, 'No User', '/login/?reset=true')));
      return;
    }

    const token = crypto.randomBytes(32).toString('hex');
    user.resetAuth = { token, expiry: Date.now() + 1000 * 60 * 60 };
    await user.save();
    // sendMail(token, user.email); // disabled in production
    res.redirect(`/login/?token=${token}`); // production: nav direct to link sent in email
  } catch (error) {
    return next(new AppError(500, error));
  }
};

const postNewPassword: RequestHandler = async (req, res, next) => {
  if (!req.session.resetAuth) return res.redirect('/login');

  const { token, userId } = req.session.resetAuth;
  const redirect = `/login/?token=${token}` as const;

  try {
    const user = await User.findOne({
                     _id: userId,
       'resetAuth.token': token,
      'resetAuth.expiry': { $gt: Date.now() },
    });

    if (!user) {
      req.session.errors = { email: 'not found' };
      req.session.save(() => next(new AppError(401, 'No user found', '/login')));
      return;
    }

    const errors = getErrors(req);
    if (hasErrors(errors)) {
      req.session.errors = errors;
      req.session.save(() => next(new AppError(422, errors, redirect)));
      return;
    }

    const { password } = req.body;
    const hashed = await bcrypt.hash(password, 12);
    user.password  = hashed;
    user.resetAuth = undefined;
    req.session.resetAuth = undefined;
    await user.save();
    res.redirect('/login');
  } catch (error) {
    return next(new AppError(500, error));
  }
};

export { getLogin, postLogin, postLogout, postSignup, postReset, postNewPassword };

import { RequestHandler } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import errorMsg from '../util/errorMsg';
import { MongooseErrors, mongooseErrors } from '../validation/mongooseErrors';
import { sendMail } from '../util/sendmail';
import { validationResult } from 'express-validator';

const getLogin: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    const { signup, reset, token } = req.query;
    let state: keyof typeof titles = 'login';

    const titles = {
         login: 'Login',
        signup: 'Sign Up',
         reset: 'Reset Password',
      password: 'Set New Password',
    };

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
      isActive: '/login',
          view: 'login',
        styles: ['login'],
        locals: { state },
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
  const { name, email, password } = req.body;

  const errors = validationResult(req)
    .array()
    .map((err) => ({ [err.path]: err.msg }))
    .reduce((acc, curr) => ({ ...acc, ...curr }), {});

  if (Object.keys(errors).length > 0) {
    errorMsg({ error: errors, where: 'postSignup' });
    req.session.errors = errors;
    req.session.save(() => res.redirect('/login/?signup=true'));
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
    req.session.errors = mongooseErrors(error as MongooseErrors);
    req.session.save(() => res.redirect('/login/?signup=true'));
  }
};

const postReset: RequestHandler = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    user.resetAuth = { token, expiry: Date.now() + 1000 * 60 * 60 };
    await user.save();
    sendMail(token); // emails preconfigured, only token is needed
    res.redirect('/login');
  } else {
    req.session.errors = { email: 'invalid' };
    req.session.save(() => res.redirect('login/?reset=true'));
  }
};

const postNewPassword: RequestHandler = async (req, res, next) => {
  if (!req.session.resetAuth) {
    return res.redirect('/login');
  }

  const { token, userId } = req.session.resetAuth;
  try {
    const user = await User.findOne({
                     _id: userId,
       'resetAuth.token': token,
      'resetAuth.expiry': { $gt: Date.now() },
    });

    if (user) {
      console.log('USER FOUND', user);
      const { password, confirm_password } = req.body;

      if (!password.trim() || !confirm_password.trim() || password !== confirm_password) {
        const error = password.trim() !== confirm_password.trim() ? "doesn't match" : 'required';
        errorMsg({ error, where: 'postNewPassword' });
        req.session.errors = { password: error };
        req.session.save(() => res.redirect('/login/?token=' + token));
        return;
      }

      try {
        const hashed = await bcrypt.hash(password, 12);
        user.password = hashed;
        user.resetAuth = undefined;
        req.session.resetAuth = undefined;
        await user.save();
        res.redirect('/login');
      } catch (error) {
        errorMsg({ error, where: 'postNewPassword' });
        req.session.errors = mongooseErrors(error as MongooseErrors);
        req.session.save(() => res.redirect('/login/?token=' + token));
      }
    }
  } catch (error) {
    errorMsg({ error, where: 'postNewPassword' });
    res.redirect('/login');
  }
};

export { getLogin, postLogin, postLogout, postSignup, postReset, postNewPassword };

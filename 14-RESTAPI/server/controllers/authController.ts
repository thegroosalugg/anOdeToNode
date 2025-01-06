import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import errorMsg from '../util/errorMsg';
import { getErrors, hasErrors } from '../validation/validators';

const getLogin: RequestHandler = async (req, res, next) => {
  try {
    const user = await User.findOne({ _id: '67768c6bfa4804119c44db20' });
    res.status(200).json(user);
  } catch (error) {
    errorMsg({ error, where: 'getLogin' });
    res.status(500).json({ message: 'Unable to login.' });
  }
};

const postSignup: RequestHandler = async (req, res, next) => {
  try {
    const { name, surname, email, password } = req.body;

    const errors = getErrors(req);
    if (hasErrors(errors)) {
      errorMsg({ error: errors, where: 'postSignup' });
      res.status(422).json(errors);
      return;
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = new User({ name, surname, email, password: hashed });
    await user.save();
    res.status(201).json(user);
  } catch (error) {
    errorMsg({ error, where: 'postSignup' });
    res.status(500).json({ message: 'Sign up failed.' });
  }
};

export { getLogin, postSignup };

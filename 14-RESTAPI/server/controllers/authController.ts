import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User';
import errorMsg from '../util/errorMsg';
import { getErrors, hasErrors } from '../validation/validators';

const postLogin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ email: 'is incorrect' });
      return;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(404).json({ password: 'is incorrect' });
      return;
    }

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

export { postLogin, postSignup };

import { RequestHandler } from 'express';
import User from '../models/User';
import errorMsg from '../util/errorMsg';

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
    const user = new User({ name: 'Jay', surname: 'Son', email: 'json@e.co', password: '123' });
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    errorMsg({ error, where: 'postSignup' });
    res.status(500).json({ message: 'Sign up failed.' });
  }
};

export { getLogin, postSignup };

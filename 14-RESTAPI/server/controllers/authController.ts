import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import errorMsg from '../util/errorMsg';
import { getErrors, hasErrors } from '../validation/validators';

const getUser: RequestHandler = async (req, res, next) => {
  const token = req.get('authorization')?.split(' ')[1];

  if (!token) {
    res.status(404).json({ message: 'Session not found' });
    return;
  }

  try {
    const decodedTkn = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decodedTkn.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(200).json(user);
  } catch (error) {
    errorMsg({ error, where: 'getUser' });
    res.status(401).json({ message: 'Invalid session' });
  }
};

const postLogin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ email: 'is incorrect', password: 'is incorrect' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(404).json({ password: 'is incorrect' });
      return;
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '15m',
    });

    const { password: _, ...userDets } = user.toObject(); // send non sensitive data
    res.status(200).json({ token, ...userDets });
  } catch (error) {
    errorMsg({ error, where: 'postLogin' });
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
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '15m',
    });
    const { password: _, ...userDets } = user.toObject(); // send non sensitive data
    res.status(201).json({ token, ...userDets });
  } catch (error) {
    errorMsg({ error, where: 'postSignup' });
    res.status(500).json({ message: 'Sign up failed.' });
  }
};

export { getUser, postLogin, postSignup };

import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import errorMsg from '../util/errorMsg';
import { getErrors, hasErrors } from '../validation/validators';

const mins = '15m';
const days = '7d';

const getUser: RequestHandler = async (req, res, next) => {
  // handled by middleware, requires a controller to receive requests
    res.status(200).json({...req.user?.toObject()});
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

    const userId = user._id;
    const JWTaccess = jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: mins,
    });

    const JWTrefresh = jwt.sign({ userId }, process.env.JWT_REFRESH!, {
      expiresIn: days,
    });


    const { password: _, ...userDets } = user.toObject(); // send non sensitive data
    res.status(200).json({ JWTaccess, JWTrefresh, ...userDets });
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

    const userId = user._id;
    const JWTaccess = jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: mins,
    });

    const JWTrefresh = jwt.sign({ userId }, process.env.JWT_REFRESH!, {
      expiresIn: days,
    });

    const { password: _, ...userDets } = user.toObject(); // send non sensitive data
    res.status(201).json({ JWTaccess, JWTrefresh, ...userDets });
  } catch (error) {
    errorMsg({ error, where: 'postSignup' });
    res.status(500).json({ message: 'Sign up failed.' });
  }
};

const refreshToken: RequestHandler = async (req, res, next) => {
  const token = req.get('authorization')?.split(' ')[1];

  if (!token) {
    res.status(401).json({ message: 'No refresh token provided' });
    return;
  }

  try {
    const decodedTkn = jwt.verify(token, process.env.JWT_REFRESH!) as JwtPayload;
    const { userId } = decodedTkn;
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    const  JWTaccess = jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: mins,
    });
    const JWTrefresh = jwt.sign({ userId }, process.env.JWT_REFRESH!, {
      expiresIn: days,
    });
    res.status(200).json({ JWTaccess, JWTrefresh });
  } catch (error) {
    errorMsg({ error, where: 'refreshToken' });
    res.status(401).json(null);
  }
}

export { getUser, postLogin, postSignup, refreshToken };

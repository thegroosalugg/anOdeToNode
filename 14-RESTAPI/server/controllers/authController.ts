import { RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { io } from '../app';
import User, { _public } from '../models/User';
import AppError from '../models/Error';
import { getErrors, hasErrors } from '../validation/validators';

const mins = '15m';
const days = '7d';

// verified by middleware, requires a endpoint to return user data
const getUser: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(AppError.devErr());

  try {
    await user.populate('friends.user', _public);
    res.status(200).json({ ...user.toObject() });
  } catch (error) {
    // returns unpopulated data
    res.status(200).json({ ...user.toObject(), message: 'unable to load friends' });
  }
};

const postLogin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return next(new AppError(401, { email: 'is incorrect', password: 'is incorrect' }));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError(401, { password: 'is incorrect' }));
    }

    const userId = user._id;
    const JWTaccess = jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: mins,
    });

    const JWTrefresh = jwt.sign({ userId }, process.env.JWT_REFRESH!, {
      expiresIn: days,
    });

    await user.populate('friends.user', _public);
    const { password: _, ...userDets } = user.toObject(); // send non sensitive data
    res.status(200).json({ JWTaccess, JWTrefresh, ...userDets });
  } catch (error) {
    next(new AppError(500, 'Unable to login.', error));
  }
};

const postSignup: RequestHandler = async (req, res, next) => {
  try {
    const { name, surname, email, password } = req.body;

    const errors = getErrors(req);
    if (hasErrors(errors)) return next(new AppError(422, errors));

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
    io.emit('user:new', userDets);
    res.status(201).json({ JWTaccess, JWTrefresh, ...userDets });
  } catch (error) {
    next(new AppError(500, 'Sign up failed.', error));
  }
};

const refreshToken: RequestHandler = async (req, res, next) => {
  const token = req.get('authorization')?.split(' ')[1];

  if (!token) return next(new AppError(401, 'No refresh token provided'));

  try {
    const decodedTkn = jwt.verify(token, process.env.JWT_REFRESH!) as JwtPayload;
    const { userId } = decodedTkn;
    const user = await User.findById(userId);
    if (!user) return next(new AppError(404, 'User not found'));

    const JWTaccess = jwt.sign({ userId }, process.env.JWT_SECRET!, {
      expiresIn: mins,
    });
    const JWTrefresh = jwt.sign({ userId }, process.env.JWT_REFRESH!, {
      expiresIn: days,
    });
    res.status(200).json({ JWTaccess, JWTrefresh });
  } catch (error) {
    next(new AppError(401, null, error));
  }
};

export { getUser, postLogin, postSignup, refreshToken };

import { RequestHandler } from 'express';
import socket from '../socket';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User, { _friends } from '../models/User';
import AppError from '../models/Error';
import { getErrors, hasErrors } from '../validation/validators';
import { JWT_SECRET, JWT_REFRESH } from '../envs';
import { Types } from 'mongoose';

const mins = '15m';
const days = '7d';

const signJWT = (userId: string | Types.ObjectId) => {
  const JWTaccess  = jwt.sign({ userId }, JWT_SECRET,  { expiresIn: mins });
  const JWTrefresh = jwt.sign({ userId }, JWT_REFRESH, { expiresIn: days });
  return { JWTaccess, JWTrefresh };
};

const postLogin: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return next(
        new AppError(401, {
             email: "Email is incorrect",
          password: "Password is incorrect",
        })
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return next(new AppError(401, { password: 'Password is incorrect' }));
    }

    const { JWTaccess, JWTrefresh } = signJWT(user._id);
    await user.populate('friends.user', _friends);
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

    const { JWTaccess, JWTrefresh } = signJWT(user._id);
    const { password: _, ...userDets } = user.toObject(); // send non sensitive data
    socket.getIO().emit('user:new', userDets);
    res.status(201).json({ JWTaccess, JWTrefresh, ...userDets });
  } catch (error) {
    next(new AppError(500, 'Sign up failed.', error));
  }
};

const refreshToken: RequestHandler = async (req, res, next) => {
  const token = req.get('authorization')?.split(' ')[1];

  if (!token) return next(new AppError(401, 'No refresh token provided'));

  try {
    const decodedTkn = jwt.verify(token, JWT_REFRESH) as JwtPayload;
    const { userId } = decodedTkn;
    const user = await User.findById(userId).select('-password');
    if (!user) return next(new AppError(404, 'User not found'));

    const { JWTaccess, JWTrefresh } = signJWT(userId);
    const { populate } = req.query;
    if (populate === 'true') await user.populate('friends.user', _friends);

    const resData = { JWTaccess, JWTrefresh, ...user.toObject() };
    res.status(200).json(resData);
  } catch (error) {
    next(new AppError(401, null, error));
  }
};

export { postLogin, postSignup, refreshToken };

import { RequestHandler } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import AppError from '../models/Error';
import { deleteFile } from '../util/deleteFile';

export const authJWT: RequestHandler = async (req, res, next) => {
  if (req.method === 'OPTIONS') return next(); // Skip token validation for preflight

  const image = req.file;
  const token = req.get('authorization')?.split(' ')[1]; // split string @ 'Bearer ' whitespace
  if (!token) {
    if (image) deleteFile(image.path);
    return next(new AppError(401, 'You are not logged in'));
  }

  try {
    const decodedTkn = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decodedTkn.userId).select('-password');
    if (!user) {
      if (image) deleteFile(image.path);
      return next(new AppError(404, 'User not found'));
    }
    req.user = user;
    next();
  } catch (error) {
    if (image) deleteFile(image.path);

    const refresh = error instanceof jwt.TokenExpiredError;
    const message =
      error instanceof jwt.TokenExpiredError
        ? 'Session expired'
        : error instanceof jwt.JsonWebTokenError
        ? 'Invalid session'
        : 'You were logged out';

    next(new AppError(401, { message, refresh }));
  }
};

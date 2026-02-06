import { JWT_SECRET } from '../envs';
import { RequestHandler } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import AppError from '../models/Error';
import { deleteFile } from '../util/deleteFile';

export const authJWT: RequestHandler = async (req, res, next) => {
  if (req.method === 'OPTIONS') return next(); // Skip token validation for preflight

  const image = req.file;

  const deleteImage = () => {
    if (image) deleteFile(image.path); // removed stored images if auth fails on request
  }

  const token = req.get('authorization')?.split(' ')[1]; // split string @ 'Bearer ' whitespace
  if (!token) {
    deleteImage();
    return next(new AppError(401, 'You are not logged in'));
  }

  try {
    const { userId } = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const user = await User.findById(userId).select('-password');
    if (!user) {
      deleteImage();
      return next(new AppError(404, 'User not found'));
    }
    req.user = user;
    next();
  } catch (error) {
    deleteImage();
    next(new AppError(401, 'Your session has expired', error));
  }
};

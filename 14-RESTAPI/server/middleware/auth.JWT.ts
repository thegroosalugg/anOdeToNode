import { RequestHandler } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';
import captainsLog from '../util/captainsLog';
import { deleteFile } from '../util/deleteFile';

export const authJWT: RequestHandler = async (req, res, next) => {
  if (req.method === 'OPTIONS') return next(); // Skip token validation for preflight

  const image = req.file;
  const token = req.get('authorization')?.split(' ')[1]; // split string @ 'Bearer ' whitespace
  if (!token) {
    res.status(401).json({ message: 'You are not logged in' });
    if (image) deleteFile(image.path);
    return;
  }

  try {
    const decodedTkn = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decodedTkn.userId).select('-password');
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      if (image) deleteFile(image.path);
      return;
    }
    req.user = user;
    next();
  } catch (error) {
    captainsLog(6, 'authJWT', error);
    if (image) deleteFile(image.path);

    const refresh = error instanceof jwt.TokenExpiredError;
    const message =
      error instanceof jwt.TokenExpiredError
        ? 'Session expired'
        : error instanceof jwt.JsonWebTokenError
        ? 'Invalid session'
        : 'You were logged out';

    res.status(401).json({ message, refresh });
  }
};

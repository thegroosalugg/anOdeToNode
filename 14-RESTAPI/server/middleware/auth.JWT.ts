import { RequestHandler } from 'express';
import { Types } from 'mongoose';
import { unlink } from 'fs';
import jwt from 'jsonwebtoken';
import errorMsg from '../util/errorMsg';

export const authJWT: RequestHandler = (req, res, next) => {
  if (req.method === 'OPTIONS') return next(); // Skip token validation for preflight

  const token = req.get('authorization')?.split(' ')[1]; // split string @ 'Bearer ' whitespace
  if (!token) {
    res.status(401).json({ message: 'You are not logged in' });
    return;
  }

  try {
    const decodedTkn = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    const _id = new Types.ObjectId(decodedTkn.userId); // convert string to Mongo Object ID
    req.user = _id;
    next();
  } catch (error) {
    errorMsg({ error, where: 'authJWT' });

    if (req.file) // delete req files if middleware catches error before controller
      unlink(req.file.path, (error) => errorMsg({ error, where: 'authJWT FS Unlink' }));

    const message =
      error instanceof jwt.TokenExpiredError
        ? 'Session expired'
        : error instanceof jwt.JsonWebTokenError
        ? 'Invalid session'
        : 'You were logged out';
        
    res.status(401).json({ message });
  }
};

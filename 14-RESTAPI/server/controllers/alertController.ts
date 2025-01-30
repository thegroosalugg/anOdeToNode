import { RequestHandler } from 'express';
import AppError from '../models/Error';

const _public = '-email -password -friends';
const  devErr = 'Do not use without AuthJWT';

const markAsRead: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError(403, 'Something went wrong', devErr));

  try {
    user.friends.forEach(({ meta }) => (meta.read = true));
    await user.save();
    await user.populate('friends.user', _public);
    res.status(200).json(user);
  } catch (error) {
    next(new AppError(500, 'unable to update notifications', error));
  }
};

const clearAlert: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError(403, 'Something went wrong', devErr));

  try {
    const { alertId } = req.params;
    user.friends.forEach(({ _id, meta }) => {
      if (_id.toString() === alertId) meta.show = false;
    });
    await user.save();
    await user.populate('friends.user', _public);
    res.status(200).json(user);
  } catch (error) {
    next(new AppError(500, 'unable to remove notification', error));
  }
};

export { markAsRead, clearAlert };

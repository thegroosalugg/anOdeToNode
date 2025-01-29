import { RequestHandler } from "express";
import captainsLog from "../util/captainsLog";

const _public = '-email -password -friends';

const markAsRead: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next('Do not use without AuthJWT');

  try {
    user.friends.forEach(({ meta }) => meta.read = true);
    await user.save();
    await user.populate('friends.user', _public);
    res.status(200).json(user);
  } catch (error) {
    captainsLog(5, 'markAsRead Catch', error);
    res.status(500).json({ message: 'unable to update notifications' });
  }
};

const clearAlert: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next('Do not use without AuthJWT');

  try {
    const { alertId } = req.params;
    user.friends.forEach(({ _id, meta }) => {
      if (_id.toString() === alertId) meta.show = false;
    });
    await user.save();
    await user.populate('friends.user', _public);
    res.status(200).json(user);
  } catch (error) {
    captainsLog(5, 'clearAlert Catch', error);
    res.status(500).json({ message: 'unable to remove notification' });
  }
};

export { markAsRead, clearAlert };

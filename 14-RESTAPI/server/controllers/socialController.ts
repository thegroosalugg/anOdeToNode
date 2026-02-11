import { RequestHandler } from 'express';
import socket from '../socket';
import User, { _friends, _full, FriendAction } from '../models/User';
import AppError from '../models/Error';

const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const    query = { _id: { $ne: req.user }};
    const    limit = +(req.query.limit || 10);
    const    page  = +(req.query.page  ||  1);
    const docCount = await User.find(query).countDocuments();
    const    items = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(_friends)
      .sort({ createdAt: -1 });

    if (!items) return next(new AppError(404, 'No users found'));
    res.status(200).json({ items, docCount });
  } catch (error) {
    next(new AppError(500, 'unable to load users', error));
  }
};

const getUserById: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(AppError.devErr());

  try {
    const { userId } = req.params;
    const peer = await User.findById(userId)
      .select(_full)
      .populate("friends.user", _friends);
    if (!peer) return next(new AppError(404, "User not found"));
    res.status(200).json(peer);
  } catch (error) {
    next(new AppError(500, "unable to load user", error));
  }
};

const friendRequest: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(AppError.devErr());

  const { userId, action } = req.params;

  const isFriendAction = (value: string): value is FriendAction => ['add', 'accept', 'delete'].includes(value);
  if (!isFriendAction(action)) return next(new AppError(400, 'Invalid action'));

  try {
    const peer = await User.findById(userId);
    if (!peer) return next(new AppError(404, 'User not found'));

    const error = user.request(peer, action);
    if (error) return next(new AppError(400, 'Request invalid', error));

    await peer.save();
    await user.save();
    await peer.populate('friends.user', _friends);
    await user.populate('friends.user', _friends);
    const io = socket.getIO();
    io.emit(`peer:${user._id}:update`, user);
    io.emit(`peer:${peer._id}:update`, peer);
    res.status(201).json({ message: 'success' });
  } catch (error) {
    next(new AppError(500, 'Request could not be completed.', error));
  }
};

export { getUsers, getUserById, friendRequest };

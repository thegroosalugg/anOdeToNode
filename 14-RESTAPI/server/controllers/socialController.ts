import { RequestHandler } from 'express';
import { io } from '../app';
import User, { IFriend } from '../models/User';
import AppError from '../models/Error';

const _public = '-email -password';
const  devErr = 'Do not use without AuthJWT';

const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const    query = { _id: { $ne: req.user }};
    const    limit = 15;
    const    page  = +(req.query.page || 1);
    const docCount = await User.find(query).countDocuments();
    const    items = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(_public)
      .sort({ createdAt: -1 });

    if (!items) return next(new AppError(404, 'No users found'));
    res.status(200).json({ items, docCount });
  } catch (error) {
    next(new AppError(500, 'unable to load users', error));
  }
};

const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(_public);
    if (!user) return next(new AppError(404, 'User not found'));
    res.status(200).json(user);
  } catch (error) {
    next(new AppError(500, 'unable to load user', error));
  }
};

const friendRequest: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError(403, 'Something went wrong', devErr));

  try {
    const { userId, action } = req.params;
    const peer = await User.findById(userId);

    if (!peer) return next(new AppError(404, 'User not found'));

    const peerIndex = peer.friends.findIndex(
      (friend) => friend.user.toString() === user._id.toString()
    );

    const userIndex = user.friends.findIndex(
      (friend) => friend.user.toString() === peer._id.toString()
    );

    switch (action) {
      case 'add': // meta is created by Mongoose, but required here, therefore type asserted
        peer.friends.push({ user: user._id, initiated: false } as IFriend);
        user.friends.push({ user: peer._id, initiated: true  } as IFriend);
        break;
      case 'accept':
        peer.friends[peerIndex].accepted = true;
        user.friends[userIndex].accepted = true;
        break;
      case 'delete':
        peer.friends.splice(peerIndex, 1);
        user.friends.splice(userIndex, 1);
        break;
      default:
        return next(new AppError(400, 'Invalid action'));
    }

    await peer.save();
    await user.save();
    io.emit(`peer:${user._id}:update`, user);
    io.emit(`peer:${peer._id}:update`, peer);
    res.status(201).json({ message: 'success' });
  } catch (error) {
    next(new AppError(500, 'Request could not be completed.', error));
  }
};

export { getUsers, getUserById, friendRequest };

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
    const    users = await User.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .select(_public)
      .sort({ _id: -1 });

    if (!users) return next(new AppError(404, ['No users found', 'getUsers !users']));
    res.status(200).json({ users, docCount });
  } catch (error) {
    next(new AppError(500, ['unable to load users', 'getUsers catch'], error));
  }
};

const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(_public);
    if (!user) return next(new AppError(404, ['User not found', 'getUserById !user']));
    res.status(200).json(user);
  } catch (error) {
    next(new AppError(500, ['unable to load user', 'getUserById catch'], error));
  }
};

const friendRequest: RequestHandler = async (req, res, next) => {
  if (!req.user) return next(new AppError(403, ['', 'friendRequest !req.user'], devErr));

  try {
    const { userId, action } = req.params;
    const peer = await User.findById(userId);
    const user = req.user;

    if (!peer) return next(new AppError(404, ['User not found', 'friendRequest !peer']));

    const peerIndex = peer.friends.findIndex(
      (friend) => friend.user.toString() === user._id.toString()
    );

    const userIndex = user.friends.findIndex(
      (friend) => friend.user.toString() === peer._id.toString()
    );

    switch (action) {
      case 'add': // meta is created by Mongoose, but required here, therefore type asserted
        peer.friends.push({ user: user._id, status: 'received' } as IFriend);
        user.friends.push({ user: peer._id, status: 'sent'     } as IFriend);
        break;
      case 'accept':
        peer.friends[peerIndex].status = 'accepted';
        user.friends[userIndex].status = 'accepted';
        break;
      case 'delete':
        peer.friends.splice(peerIndex, 1);
        user.friends.splice(userIndex, 1);
        break;
      default:
        return next(new AppError(400, ['Invalid action', 'friendRequest switch']));
    }

    await peer.save();
    await user.save();
    io.emit(`peer:${user._id}:update`, user);
    io.emit(`peer:${peer._id}:update`, peer);
    res.status(201).json({ message: 'success' });
  } catch (error) {
    next(new AppError(500, ['Request could not be completed.', 'friendRequest catch'], error));
  }
};

export { getUsers, getUserById, friendRequest };

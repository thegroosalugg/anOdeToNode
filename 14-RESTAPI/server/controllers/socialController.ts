import { RequestHandler } from 'express';
import { io } from '../app';
import User from '../models/User';
import captainsLog from '../util/captainsLog';

const _public = '-email -password';

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

    if (!users) {
      res.status(404).json({ message: 'No users found' });
      return;
    }

    res.status(200).json({ users, docCount });
  } catch (error) {
    captainsLog(5, 'getUsers Catch', error);
    res.status(500).json({ message: 'unable to load users' });
  }
};

const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select(_public);
    if (!user) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    captainsLog(5, 'getUserById Catch', error);
    res.status(500).json({ message: 'Unable to load user.' });
  }
};

const sendFriendReq: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    res.status(401).json({ message: 'incorrect use of controller' });
    return;
  }

  try {
    const { userId } = req.params;
    const peer = await User.findById(userId);
    const user = req.user;

    if (!peer) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    const reqExists = peer.friends.some(friend =>
      friend.user.toString() === user._id.toString()
    );

    if (reqExists) {
      res.status(409).json({ message: 'Request already sent' });
      return;
    }

    peer.friends.push({ user: user._id, status: 'received' });
    await peer.save();

    user.friends.push({ user: peer._id, status: 'sent' });
    await user.save();

    io.emit(`peer:${peer._id}:update`, user);
    res.status(201).json({ message: 'success' });
  } catch (error) {
    captainsLog(5, 'addFriend Catch', error);
    res.status(500).json({ message: 'Add request could not be completed.' });
  }
};

export { getUsers, getUserById, sendFriendReq };

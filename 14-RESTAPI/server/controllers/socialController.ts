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

const friendRequest: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    res.status(403).json({ message: 'Access denied: missing authentication' });
    return;
  }

  try {
    const { userId, action } = req.params;
    const peer = await User.findById(userId);
    const user = req.user;

    if (!peer) {
      res.status(404).json({ message: 'User not found.' });
      return;
    }

    const peerIndex = peer.friends.findIndex(
      (friend) => friend.user.toString() === user._id.toString()
    );

    const userIndex = user.friends.findIndex(
      (friend) => friend.user.toString() === peer._id.toString()
    );

    switch (action) {
      case 'add':
        peer.friends.push({ user: user._id, status: 'received' });
        user.friends.push({ user: peer._id, status: 'sent' });
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
        res.status(400).json({ message: 'Invalid action' });
        return;
    }

    await peer.save();
    await user.save();
    io.emit(`peer:${user._id}:update`, user);
    io.emit(`peer:${peer._id}:update`, peer);
    res.status(201).json({ message: 'success' });
  } catch (error) {
    captainsLog(5, 'addFriend Catch', error);
    res.status(500).json({ message: 'Request could not be completed.' });
  }
};

export { getUsers, getUserById, friendRequest };

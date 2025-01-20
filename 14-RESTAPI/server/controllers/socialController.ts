import { RequestHandler } from 'express';
import { io } from '../app';
import User from '../models/User';
import captainsLog from '../util/captainsLog';

const _public = '-email -password';

const getUsers: RequestHandler = async (req, res, next) => {
  try {
    const    limit = 15;
    const    page  = +(req.query.page || 1);
    const docCount = await User.find().countDocuments();
    const    users = await User.find()
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

export { getUsers };

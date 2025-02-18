import { RequestHandler } from 'express';
import AppError from '../models/Error';
import User from '../models/User';
import Chat from '../models/Chat';
import { Types } from 'mongoose';

const _public = '-email -password -friends';
const  devErr = 'Do not use without AuthJWT';

const getChats: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError(403, 'Something went wrong', devErr));

  try {
    const chats = await Chat.find({
      $or: [{ host: user }, { guest: user }],
    }).populate('host guest', _public);

    res.status(200).json(chats);
  } catch (error) {
    next(new AppError(500, 'Chats could not be loaded', error));
  }
};

const findChat: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError(403, 'Something went wrong', devErr));

  try {
    const { userId } = req.params;
    const peer = await User.findById(userId);
    if (!peer) return next(new AppError(404, 'User not found'));

    const chat = await Chat.findOne({
      $or: [
        { host: user, guest: peer },
        { host: peer, guest: user },
      ],
    }).populate('host guest', _public);

    if (chat) {
      res.status(200).json(chat);
      return;
    }

    // chat creation is handled by MSG schema when first message is sent
    // however, newChat is created for the client so it can create chat interface
    peer.set({ email: 'hidden', friends: [] });
    const newChat = new Chat({ host: user, guest: peer });
    res.status(201).json(newChat);
  } catch (error) {
    next(new AppError(500, 'Unable to start chat', error));
  }
};

const deleteChat: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError(403, 'Something went wrong', devErr));

  try {
    const  data = req.body;
    const   ids = Object.keys(data).filter(id => data[id]);
    const chats = await Chat.find({ _id: { $in: ids } });
    if (chats.length === 0) return next(new AppError(404, 'No chats to delete'));

    const toDelete: Types.ObjectId[] = [];
    const toUpdate: Types.ObjectId[] = [];

    chats.forEach((chat) => {
      chat.deletedFor.set(user._id.toString(), true);
      if (
        chat.deletedFor.get(chat.host.toString()) &&
        chat.deletedFor.get(chat.guest.toString())
      ) {
        toDelete.push(chat._id);
      } else {
        toUpdate.push(chat._id);
      }
    });

    if (toDelete.length > 0) {
      await Chat.deleteMany({ _id: { $in: toDelete } });
    }

    if (toUpdate.length > 0) {
      await Chat.updateMany(
        { _id: { $in: toUpdate } },
        { $set: { 'deletedFor': { [user._id.toString()]: true } } }
      );
    }

    res.status(200).json(chats);
  } catch (error) {
    next(new AppError(500, 'Unable to delete chats', error));
  }
};

export { getChats, findChat, deleteChat };

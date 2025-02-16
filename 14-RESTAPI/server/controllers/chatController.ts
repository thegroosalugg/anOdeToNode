import { RequestHandler } from 'express';
import AppError from '../models/Error';
import User from '../models/User';
import Chat from '../models/Chat';

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

const deleteChat: RequestHandler = async (req, res, next) => {};

export { getChats, findChat, deleteChat };

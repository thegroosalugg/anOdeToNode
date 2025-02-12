import { RequestHandler } from 'express';
import { io } from '../app';
import AppError from '../models/Error';
import User from '../models/User';
import Chat from '../models/Chat';

const _public = '-email -password -friends';
const  devErr = 'Do not use without AuthJWT';

const getChats: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError(403, 'Something went wrong', devErr));

  try {
    const chats = await Chat.find({ $or: [{ user }, { peer: user }] }).populate('user peer', _public);
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
      $or: [{ user, peer }, { user: peer, peer: user }]
    }).populate('user peer', _public);
    if (chat) {
      res.status(200).json(chat);
      return;
    }

    // chat creation is handled by MSG schema when first message is sent
    // however, newChat is created for the client so it can create chat interface
    peer.set({ email: 'hidden', friends: [] });
    const newChat = new Chat({ user, peer });
    // io.emit(`chat:${user._id}:new`, newChat);
    // io.emit(`chat:${peer._id}:new`, newChat);
    res.status(201).json(newChat);
  } catch (error) {
    next(new AppError(500, 'Unable to start chat', error));
  }
};

const deleteChat: RequestHandler = async (req, res, next) => {};

export { getChats, findChat, deleteChat };

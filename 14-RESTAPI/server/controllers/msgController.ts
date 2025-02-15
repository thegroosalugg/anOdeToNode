import { RequestHandler } from 'express';
import { io } from '../app';
import AppError from '../models/Error';
import User from '../models/User';
import Chat from '../models/Chat';
import Msg from '../models/Msg';
import { getErrors, hasErrors } from '../validation/validators';

const _public = '-email -password -friends';
const devErr = 'Do not use without AuthJWT';

const getMessages: RequestHandler = async (req, res, next) => {
  try {
    const { chatId } = req.params;
    const messages = await Msg.find({ chat: chatId });
    res.status(200).json(messages);
  } catch (error) {
    next(new AppError(500, 'Messages could not be loaded', error));
  }
};

const newMessage: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError(403, 'Something went wrong', devErr));

  try {
    const errors = getErrors(req);
    if (hasErrors(errors)) return next(new AppError(422, errors));

    const { content } = req.body;
    const { userId  } = req.params;
    const peer = await User.findById(userId);
    if (!peer) return next(new AppError(404, 'User not found'));

    let isNew = false;
    let chat = await Chat.findOne({
      $or: [
        { user, peer },
        { user: peer, peer: user },
      ],
    });

    if (!chat) {
      chat = new Chat({ user: user._id, peer: peer._id });
      isNew = true;
    }

    const msg = await Msg.create({ content, sender: user._id, chat: chat._id });
    chat.lastMsg = msg;
    await chat.save();
    peer.set({ email: 'hidden', friends: [] });
    if (chat.user.toString() === user._id.toString()) {
      chat.set({ user, peer }); // Original user was requester
    } else {
      chat.set({ user: peer, peer: user });
    } // in place of populate as all data is already here

    io.emit(`chat:${user._id}:update`, { chat, isNew, msg });
    io.emit(`chat:${peer._id}:update`, { chat, isNew, msg });
    res.status(201).json(msg);
  } catch (error) {
    next(new AppError(500, 'Unable send message', error));
  }
};

export { getMessages, newMessage };

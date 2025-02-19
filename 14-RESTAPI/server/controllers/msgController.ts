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
    const  messages  = await Msg.find({ chat: chatId });
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
    const peerId = peer._id.toString();
    // peerId is only for when a string is needed. In other instances peer._id will stay

    let isNew          = false;
    let isNewOrRevived = false;
    let chat = await Chat.findOne({
      $or: [
        { host: user, guest: peer },
        { host: peer, guest: user },
      ],
    });

    if (!chat) {
      chat = new Chat({ host: user._id, guest: peer._id });
      isNew          = true;
      isNewOrRevived = true;
    } else if (chat.deletedFor.get(peerId)) {
      isNewOrRevived = true;
   }

    const msg = await Msg.create({ content, sender: user._id, chat: chat._id });
    chat.lastMsg = msg;
    chat.set('deletedFor', {});
    // count alerts for other person
    chat.alerts.set(peerId, (chat.alerts.get(peerId) || 0) + 1); // create dynamic key
    await chat.save();
    peer.set({ email: 'hidden', friends: [] });
    const [host, guest] =
      chat.host.toString() === user._id.toString() ? [user, peer] : [peer, user];
    chat.set({ host, guest });

    io.emit(`chat:${user._id}:update`, { chat, msg, isNew });
    io.emit(`chat:${peer._id}:update`, { chat, msg, isNew: isNewOrRevived });
    res.status(201).json(msg);
  } catch (error) {
    next(new AppError(500, 'Unable send message', error));
  }
};

export { getMessages, newMessage };

import { RequestHandler } from 'express';
import socket from '../socket';
import AppError from '../models/Error';
import User, { _basic } from '../models/User';
import Chat from '../models/Chat';
import Msg from '../models/Msg';
import { getErrors, hasErrors } from '../validation/validators';

const getMessages: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(AppError.devErr());

  try {
    const { chatId } = req.params;
    const   messages = await Msg.find({
      chat: chatId,
      [`deletedFor.${user._id}`]: { $ne: true },
    });
    res.status(200).json(messages);
  } catch (error) {
    next(new AppError(500, 'Messages could not be loaded', error));
  }
};

const newMessage: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(AppError.devErr());

  try {
    const errors = getErrors(req);
    if (hasErrors(errors)) return next(new AppError(422, errors));

    const { content } = req.body;
    const { userId  } = req.params;
    const peer = await User.findOne({ _id: userId }).select(_basic);
    if (!peer) return next(new AppError(404, 'User not found'));

    if (!user.isFriend(userId)) { // send msgs only to those on friends list
      return next(new AppError(403, "User is not on your friend's list"));
    }

    const userStrId = user._id.toString();
    const peerStrId = peer._id.toString();
    // above are only for when a string is needed. In other instances (us/pe)er._id will stay

    let isNew = false, isNewForPeer = false;
    let  chat = await Chat.findOne({
      $or: [
        { host: user, guest: peer },
        { host: peer, guest: user },
      ],
    });

    if (!chat) {
       chat = new Chat({ host: user._id, guest: peer._id });
      isNew = isNewForPeer = true;
    } else {
      isNew        = chat.deletedFor.get(userStrId) ?? false;
      isNewForPeer = chat.deletedFor.get(peerStrId) ?? false;
    }

    const msg = await Msg.create({ content, sender: user._id, chat: chat._id });
    chat.lastMsg = msg;
    chat.set('deletedFor', {}); // revive chat
    // count alerts for other person
    chat.alerts.set(peerStrId, (chat.alerts.get(peerStrId) || 0) + 1); // create dynamic key
    await chat.save();
    // peer.set({ email: 'hidden', friends: [] }); // sensor data
    // reset host/guest to full objects for client
    const [host, guest] =
      chat.host.toString() === userStrId ? [user, peer] : [peer, user];
    chat.set({ host, guest }); // populate not needed, as data already fetched

    const io = socket.getIO();
    io.emit(`chat:${user._id}:update`, { chat, msg, isNew });
    io.emit(`chat:${peer._id}:update`, { chat, msg, isNew: isNewForPeer });
    res.status(201).json(msg);
  } catch (error) {
    next(new AppError(500, 'Unable send message', error));
  }
};

export { getMessages, newMessage };

import { RequestHandler } from 'express';
import { Types } from 'mongoose';
import socket from '../socket';
import { _basic } from '../models/User';
import Chat from '../models/Chat';
import AppError from '../models/Error';

const getChats: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(AppError.devErr());

  try {
    const chats = await Chat.find({
      $or: [{ host: user }, { guest: user }],
      [`deletedFor.${user._id}`]: { $ne: true },
    })
    .sort({ 'lastMsg.updatedAt': -1 })
    .populate('host guest', _basic);

    res.status(200).json(chats);
  } catch (error) {
    next(new AppError(500, 'Chats could not be loaded', error));
  }
};

const deleteChats: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(AppError.devErr());

  try {
    const  data = req.body;
    const   ids = Object.keys(data).filter(id => data[id]);
    const chats = await Chat.find({ _id: { $in: ids } });
    if (chats.length === 0) return next(new AppError(404, 'No chats selected'));
    const userId = user._id.toString();

    const toDelete: Types.ObjectId[] = [];
    const toUpdate: Types.ObjectId[] = [];

    chats.forEach((chat) => {
      chat.deletedFor.set(userId, true);
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
        // { $set: { 'deletedFor': { [userId]: true } } }, // overwrites entire deletedFor obj
        {
          $set: {
            [`deletedFor.${userId}`]: true, // does not overwrite other keys
            [    `alerts.${userId}`]: 0,
          },
        },
        { userId } // pass data to pre middleware
      );
    }

    socket.getIO().emit(`chat:${user._id}:delete`, chats); // emited so nav can listen
    res.status(200).json(chats);
  } catch (error) {
    next(new AppError(500, 'Unable to delete chats', error));
  }
};

export { getChats, deleteChats };

import { RequestHandler } from 'express';
import AppError from '../models/Error';
import Post from '../models/Post';
import Reply from '../models/Reply';
import Chat from '../models/Chat';

const _public = '-email -password -friends';
const  devErr = 'Do not use without AuthJWT';

const readSocials: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError(403, 'Something went wrong', devErr));

  try {
    const { type } = req.query;
    user.friends.forEach(({ meta, accepted, initiated }) => {
      if (
        (type ===  'inbound' && !initiated) ||
        (type === 'outbound' &&  initiated && accepted)
      ) {
        meta.read = true;
      }
    });
    await user.save();
    await user.populate('friends.user', _public);
    res.status(200).json(user);
  } catch (error) {
    next(new AppError(500, 'unable to update notifications', error));
  }
};

const clearSocials: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError(403, 'Something went wrong', devErr));

  try {
    const { alertId } = req.params;
    user.friends.forEach(({ _id, meta }) => {
      if (_id.toString() === alertId) meta.show = false;
    });
    await user.save();
    await user.populate('friends.user', _public);
    res.status(200).json(user);
  } catch (error) {
    next(new AppError(500, 'unable to remove notification', error));
  }
};

const readReplies: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError(403, 'Something went wrong', devErr));

  try {
    const { read } = req.query;
    const    posts = await  Post.find({ creator: user._id }, '_id');
    const  replies = await Reply.find({
             post: { $in: posts.map((post) => post._id) },
          creator: { $ne: user._id },
      'meta.show': true,
    })
      .populate('creator', _public)
      .populate('post', 'title creator')
      .sort({ createdAt: -1 });

    if (read === 'true') {
      await Reply.updateMany(
        { _id: { $in: replies.map((reply) => reply._id) } }, // update query
        { 'meta.read': true } // update operation
      );
      replies.forEach((reply) => (reply.meta.read = true));
    }

    res.status(200).json(replies);
  } catch (error) {
    next(new AppError(500, 'unable to fetch notifications', error));
  }
};

const clearReplies: RequestHandler = async (req, res, next) => {
  try {
    const { replyId } = req.params;
    const reply = await Reply.findById(replyId);
    if (!reply) return next(new AppError(404, 'Comment not found'));
    reply.meta.show = false;
    await reply.save();
    res.status(200).json(reply);
  } catch (error) {
    next(new AppError(500, 'unable to remove notification', error));
  }
};

const clearMsgs: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError(403, 'Something went wrong', devErr));

  try {
    const { chatId } = req.params;
    const chat = await Chat.findById(chatId).populate('host guest', _public);
    if (!chat) return next(new AppError(404, 'Chat not found'));

    const userId = user._id.toString();
    chat.alerts.set(userId, 0);
    await chat.save();

    res.status(200).json(chat);
  } catch (error) {
    next(new AppError(500, 'Unable to reset alerts', error));
  }
};


export { readSocials, clearSocials, readReplies, clearReplies, clearMsgs };

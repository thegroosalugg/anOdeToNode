import { RequestHandler } from 'express';
import { io } from '../app';
import Post, { IPost } from '../models/Post';
import Reply from '../models/Reply';
import AppError from '../models/Error';
import { getErrors, hasErrors } from '../validation/validators';

const _public = '-email -password';
const  devErr = 'Do not use without AuthJWT';

const getReplies: RequestHandler = async (req, res, next) => {
  const { postId: post } = req.params;
  const page = +(req.query.page || 1);
  const limit = 8;

  try {
    const docCount = await Reply.find({ post }).countDocuments();
    const  replies = await Reply.find({ post })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('creator', _public)
      .sort({ _id: -1 });

    res.status(200).json({ replies, docCount });
  } catch (error) {
    next(new AppError(500, ['Unable to load comments', 'getReplies catch'], error));
  }
};

const postReply: RequestHandler = async (req, res, next) => {
  if (!req.user) return next(new AppError(403, ['', 'friendRequest !req.user'], devErr));

  try {
    const errors = getErrors(req);
    if (hasErrors(errors)) return next(new AppError(422, ['', 'postReply errors'], errors));

    const {  postId } = req.params;
    const { content } = req.body;
    const   creator   = req.user._id;

    const post = await Post.findById(postId);
    if (!post) return next(new AppError(404, ['Post not found', 'postReply !post']));

    const reply = new Reply({ post: post._id, content, creator });
    await reply.save();
    await reply.populate('post');
    io.emit(`post:${postId}:reply`, reply); // notify Post Page
    io.emit(`nav:${(reply.post as IPost).creator}:reply`, reply); // alert original post user
    res.status(201).json(reply);
  } catch (error) {
    next(new AppError(500, ["Message couldn't be posted", 'postReply catch'], error));
  }
};

const deleteReply: RequestHandler = async (req, res, next) => {
  try {
    const { replyId: _id } = req.params;
    const reply = await Reply.findOne({ _id, creator: req.user });
    if (!reply) return next(new AppError(404, ['Comment not found', 'deleteReply !reply']));

    await Reply.deleteOne({ _id, creator: req.user });
    io.emit(`post:${reply.post}:reply:delete`, reply); // emits back to PostID page
    res.status(200).json(null);
  } catch (error) {
    next(new AppError(500, ['Unable to delete comment', 'deletePost catch'], error));
  }
}

export { getReplies, postReply, deleteReply };

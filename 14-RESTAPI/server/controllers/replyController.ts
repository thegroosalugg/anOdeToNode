import { RequestHandler } from 'express';
import { io } from '../app';
import Post from '../models/Post';
import Reply from '../models/Reply';
import AppError from '../models/Error';
import { getErrors, hasErrors } from '../validation/validators';

const _public = '-email -password -friends';
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
    next(new AppError(500, 'Unable to load comments', error));
  }
};

const postReply: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError(403, 'Something went wrong', devErr));

  try {
    const errors = getErrors(req);
    if (hasErrors(errors)) return next(new AppError(422, errors));

    const {  postId } = req.params;
    const { content } = req.body;

    const post = await Post.findById(postId);
    if (!post) return next(new AppError(404, 'Post not found'));

    const reply = new Reply({ content, post: post._id, creator: user._id });
    await reply.save();

    const { email, friends, ...creator } = user.toObject(); // remove sensitive fields
    const sanitized   = reply.toObject() // create modifyiable copy for client
    sanitized.post    = post; // skip populate as required post/user data is already fetched
    sanitized.creator = creator;
    
    io.emit(`post:${postId}:reply`, sanitized); // notify Post Page
    io.emit(`nav:${post.creator}:reply`, sanitized); // alert original post user
    res.status(201).json(sanitized);
  } catch (error) {
    next(new AppError(500, "Message couldn't be posted", error));
  }
};

const deleteReply: RequestHandler = async (req, res, next) => {
  try {
    const { replyId: _id } = req.params;
    const reply = await Reply.findOne({ _id, creator: req.user });
    if (!reply) return next(new AppError(404, 'Comment not found'));

    await Reply.deleteOne({ _id, creator: req.user });
    io.emit(`post:${reply.post}:reply:delete`, reply); // emits back to PostID page
    res.status(200).json(null);
  } catch (error) {
    next(new AppError(500, 'Unable to delete comment', error));
  }
}

export { getReplies, postReply, deleteReply };

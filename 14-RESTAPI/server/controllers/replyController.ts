import { RequestHandler } from 'express';
import { io } from '../app';
import Post, { IPost } from '../models/Post';
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
    const    items = await Reply.find({ post })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('creator', _public)
      .sort({ createdAt: -1 });

    res.status(200).json({ items, docCount });
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

    user.set({ email: 'hidden', friends: [] });
    reply.creator = user
    reply.post    = post;

    io.emit(`post:${postId}:reply:new`, reply); // notify Post Page
    if (user._id.toString() !== post.creator.toString()) {
      io.emit(`nav:${post.creator}:reply`, { action: 'new', reply}); // alert original post user
    }
    res.status(201).json(reply);
  } catch (error) {
    next(new AppError(500, "Message couldn't be posted", error));
  }
};

const deleteReply: RequestHandler = async (req, res, next) => {
  try {
    const { replyId: _id } = req.params;
    const reply = await Reply.findOne({ _id, creator: req.user }).populate('post', 'creator');
    if (!reply) return next(new AppError(404, 'Comment not found'));

    await Reply.deleteOne({ _id, creator: req.user });
    const post = reply.post as IPost;
    io.emit(`post:${post._id}:reply:delete`, reply); // emits back to PostID page
    io.emit(`nav:${post.creator}:reply`, { action: 'delete', reply }); // alert original post user
    res.status(200).json(null);
  } catch (error) {
    next(new AppError(500, 'Unable to delete comment', error));
  }
}

export { getReplies, postReply, deleteReply };

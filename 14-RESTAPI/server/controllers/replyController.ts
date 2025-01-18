import { RequestHandler } from 'express';
import { io } from '../app';
import Post from '../models/Post';
import Reply from '../models/Reply';
import { getErrors, hasErrors } from '../validation/validators';
import captainsLog from '../util/captainsLog';

const _public = '-email -password';

const getReplies: RequestHandler = async (req, res, next) => {
  const { postId: post } = req.params;
  const page = +(req.query.page || 1);
  const limit = 10;

  try {
    const docCount = await Reply.find({ post }).countDocuments();
    const  replies = await Reply.find({ post })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('creator', _public)
      .sort({ _id: -1 });

    res.status(200).json({ replies, docCount });
  } catch (error) {
    captainsLog(5, 'getReplies Catch', error);
    res.status(500).json({ message: 'Unable to load comments' });
  }
};

const postReply: RequestHandler = async (req, res, next) => {
  try {
    const errors = getErrors(req);
    if (hasErrors(errors)) {
      res.status(422).json(errors);
      return;
    }

    const {  postId } = req.params;
    const { content } = req.body;
    const   creator   = req.user;

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const reply = new Reply({ post: post._id, content, creator });
    await reply.save();
    io.emit(`post:${postId}:reply`, reply); // emits to specfic path only
    res.status(201).json(reply);

  } catch (error) {
    captainsLog(5, 'postReply Catch', error);
    res.status(500).json({ message: "Message couldn't be posted" });
  }
};

const deleteReply: RequestHandler = async (req, res, next) => {
  try {
    const { replyId: _id } = req.params;
    const reply = await Reply.findOne({ _id, creator: req.user });

    if (!reply) {
      res.status(404).json({ message: 'Comment not found.' });
      return;
    }

    await Reply.deleteOne({ _id, creator: req.user });
    io.emit(`post:${reply.post}:reply:delete`, reply); // emits back to PostID page
    res.status(200).json(null);
  } catch (error) {
    captainsLog(5, 'deletePost Catch', error);
    res.status(500).json({ message: 'Unable to delete comment.' });
  }
}

export { getReplies, postReply, deleteReply };

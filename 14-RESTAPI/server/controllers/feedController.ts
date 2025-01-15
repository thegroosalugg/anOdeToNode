import { RequestHandler } from 'express';
import { Types } from 'mongoose';
import Post from '../models/Post';
import Reply from '../models/Reply';
import captainsLog from '../util/captainsLog';

const _public = '-email -password';

const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const  page = +(req.query.page || 1);
    const limit = req.user ? 6 : 4;
    const query: Record<string, Types.ObjectId> = {};

    if (req.user) {
      query.creator = req.user._id;
    }

    const docCount = await Post.find(query).countDocuments();
    const    posts = await Post.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('creator', _public)
      .sort({ _id: -1 }); // newest first

    if (!posts) {
      res.status(404).json({ message: 'Nothing posted yet.' });
    }

    res.status(200).json({ posts, docCount });
  } catch (error) {
    captainsLog(5, 'getPosts Catch', error);
    res.status(500).json({ message: 'Unable to load posts.' });
  }
};

const getPostById: RequestHandler = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate('creator', _public);
    if (!post) {
      res.status(404).json({ message: 'Post not found.' });
      return;
    }

    const replies = await Reply.find({ post })
      .populate('creator', _public)
      .sort({ _id: -1 });

    res.status(200).json({ ...post.toObject(), replies });
  } catch (error) {
    captainsLog(5, 'getPostById Catch', error);
    res.status(500).json({ message: 'Unable to load post.' });
  }
};

export { getPosts, getPostById };

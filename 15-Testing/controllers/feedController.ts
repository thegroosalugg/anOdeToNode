import { RequestHandler } from 'express';
import { Types } from 'mongoose';
import Post from '../models/Post';
import AppError from '../models/Error';
import { _public } from '../models/User';

// default route for all posts is /feed/posts. Accessed by /profile & /social too
const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const  isProfile = req.baseUrl === '/profile'; // controller accessed /profile
    const     isPeer = req.baseUrl === '/social';  // controller accessed /social
    const       page = +(req.query.page  ||  1);
    const      limit = +(req.query.limit || 10);
    const { userId } = req.params; // only when accessed via /social/posts
    const query: Record<string, Types.ObjectId | string> = {};

    if (req.user && isProfile) {
      query.creator = req.user._id;
    } else if (isPeer && userId) {
      query.creator = userId;
    }

    const docCount = await Post.find(query).countDocuments();
    const    items = await Post.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('creator', _public)
      .sort({ createdAt: -1 });

    if (!items) return next(new AppError(404, 'Nothing posted yet'));

    res.status(200).json({ items, docCount });
  } catch (error) {
    next(new AppError(500, 'Unable to load posts', error));
  }
};

const getPostById: RequestHandler = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate('creator', _public);
    if (!post) return next(new AppError(404, 'Post not found'));

    res.status(200).json(post);
  } catch (error) {
    next(new AppError(500, 'Unable to load post', error));
  }
};

export { getPosts, getPostById };

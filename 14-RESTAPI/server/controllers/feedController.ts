import { RequestHandler } from 'express';
import { Types } from 'mongoose';
import Post from '../models/Post';
import captainsLog from '../util/captainsLog';

const _public = '-email -password';

// default route for all posts is /feed/posts. Accessed by /profile & /social too
const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const  isProfile = req.baseUrl === '/profile'; // controller accessed /profile
    const     isPeer = req.baseUrl === '/social';  // controller accessed /social
    const       page = +(req.query.page || 1);
    const      limit = isProfile ? 6 : 4;
    const { userId } = req.params; // only when accessed via /social/posts
    const query: Record<string, Types.ObjectId | string> = {};

    if (req.user && isProfile) {
      query.creator = req.user._id;
    } else if (isPeer && userId) {
      query.creator = userId;
    }

    const docCount = await Post.find(query).countDocuments();
    const    posts = await Post.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('creator', _public)
      .sort({ _id: -1 }); // newest first

    if (!posts) {
      res.status(404).json({ message: 'Nothing posted yet.' });
      return;
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

    res.status(200).json(post);
  } catch (error) {
    captainsLog(5, 'getPostById Catch', error);
    res.status(500).json({ message: 'Unable to load post.' });
  }
};

export { getPosts, getPostById };

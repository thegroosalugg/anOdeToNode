import { RequestHandler } from 'express';
import Post from '../models/Post';
import errorMsg from '../util/errorMsg';
import { Types } from 'mongoose';

const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const  page = +(req.query.page || 1);
    const limit = req.user ? 8 : 4;
    const query: Record<string, Types.ObjectId> = {};

    if (req.user) {
      query.author = req.user._id;
    }

    const docCount = await Post.find(query).countDocuments();
    const    posts = await Post.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', '-email -password')
      .sort({ _id: -1 }); // newest first

    if (!posts) {
      res.status(404).json({ message: 'Nothing posted yet' });
    }

    res.status(200).json({ posts, docCount });
  } catch (error) {
    errorMsg({ error, where: 'getPosts' });
    res.status(500).json({ message: 'Unable to load posts.' });
  }
};

const getPostById: RequestHandler = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate('author', '-email -password');
    if (!post) {
      res.status(404).json({ message: 'Post not found.' });
      return;
    }
    res.status(200).json(post);
  } catch (error) {
    errorMsg({ error, where: 'getPostById' });
    res.status(500).json({ message: 'Unable to load post.' });
  }
};

export { getPosts, getPostById };

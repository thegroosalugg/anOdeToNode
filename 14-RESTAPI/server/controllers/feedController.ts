import { RequestHandler } from 'express';
import Post from '../models/Post';
import errorMsg from '../util/errorMsg';

const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const  page = +(req.query.page || 1);
    const limit = 4;

    const docCount = await Post.find().countDocuments();
    const    posts = await Post.find()
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('author', 'name surname')
      .sort({ _id: -1 }); // newest first

    res.status(200).json({ posts, docCount });
  } catch (error) {
    errorMsg({ error, where: 'getPosts' });
    res.status(500).json({ message: 'Unable to load posts.' });
  }
};

const getPostById: RequestHandler = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate('author', 'name surname');
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

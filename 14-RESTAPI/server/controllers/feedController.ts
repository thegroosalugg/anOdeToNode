import { RequestHandler } from 'express';
import Post from '../models/Post';
import errorMsg from '../util/errorMsg';

const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name surname')
      .sort({ _id: -1 }); // newest first

    res.status(200).json(posts);
  } catch (error) {
    errorMsg({ error, where: 'getPosts' });
    res.status(500).json({ message: 'Unable to load posts.' });
  }
};

const newPost: RequestHandler = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const post = new Post({
        title, content,
         user: '67768c6bfa4804119c44db20',
    });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    errorMsg({ error, where: 'newPost' });
    res.status(500).json({ message: 'Unable to submit your post.' });
  }
};

export { getPosts, newPost };

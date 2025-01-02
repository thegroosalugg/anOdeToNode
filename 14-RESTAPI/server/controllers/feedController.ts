import { RequestHandler } from 'express';
import Post from '../model/Post';
import errorMsg from '../util/errorMsg';

const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const feed = await Post.find().sort({ _id: -1 }); // newest first
    res.status(200).json(feed);
  } catch (error) {
    errorMsg({ error, where: 'getPosts' });
    res.status(500).json({ message: 'Unable to load posts.' });
  }
};

const newPost: RequestHandler = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const post = new Post({ title: 'Hello ' + Math.random(), content: 'New Post' });
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    errorMsg({ error, where: 'newPost' });
    res.status(500).json({ message: 'Unable to submit your post.' });
  }
};

export { getPosts, newPost };

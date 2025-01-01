import { RequestHandler } from 'express';
import Post from '../model/Post';

const getPosts: RequestHandler = async (req, res, next) => {
  const feed = await Post.find().sort({ _id: -1 }); // newest first
  res.status(200).json(feed);
};

const newPost: RequestHandler = async (req, res, next) => {
  const { title, content } = req.body;
  const post = new Post({ title: 'Hello ' + Math.random(), content: 'New Post' });
  await post.save();
  res.status(201).json(post);
};

export { getPosts, newPost };

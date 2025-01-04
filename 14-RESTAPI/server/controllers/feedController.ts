import { RequestHandler } from 'express';
import { unlink } from 'fs';
import Post from '../models/Post';
import { getErrors, hasErrors } from '../validation/validators';
import errorMsg from '../util/errorMsg';

const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name surname')
      .sort({ _id: -1 }); // newest first

    res.status(200).json(posts);
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

const newPost: RequestHandler = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const image = req.file;

    const errors = getErrors(req);
    if (hasErrors(errors)) {
      res.status(422).json(errors);
      if (image) unlink(image.path, (error) => errorMsg({ error, where: 'FS Unlink' }));
      return;
    }

    const post = new Post({ title, content, author: '67768c6bfa4804119c44db20'});
    if (image) post.imgURL = image.path;
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    errorMsg({ error, where: 'newPost' });
    res.status(500).json({ message: 'Unable to submit your post.' });
  }
};

export { getPosts, getPostById, newPost };

import { RequestHandler } from 'express';
import { unlink } from 'fs';
import Post from '../models/Post';
import { getErrors, hasErrors } from '../validation/validators';
import errorMsg from '../util/errorMsg';

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

    const post = new Post({ title, content, author: req.user });
    if (image) post.imgURL = image.path;
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    errorMsg({ error, where: 'newPost' });
    res.status(500).json({ message: 'Unable to submit your post.' });
  }
};

const editPost: RequestHandler = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    const image = req.file;

    const errors = getErrors(req);
    if (hasErrors(errors)) {
      res.status(422).json(errors);
      if (image) unlink(image.path, (error) => errorMsg({ error, where: 'FS Unlink' }));
      return;
    }

    const post = await Post.findOne({ _id: postId, author: req.user })
    if (!post) {
      res.status(404).json({ message: 'Post not found.' });
      return;
    }

    post.title = title;
    post.content = content;
    if (image) {
      if (post.imgURL) {
        unlink(post.imgURL, (error) => error && errorMsg({ error, where: 'FS Unlink' }));
      }
      post.imgURL = image.path;
    }

    await post.save();
    await post.populate('author', '-email -password');
    res.status(200).json(post);
  } catch (error) {
    errorMsg({ error, where: 'editPost' });
    res.status(500).json({ message: 'Unable to update your post.' });
  }
};

const deletePost: RequestHandler = async (req, res, next) => {
  try {
    const { postId: _id } = req.params;
    const post = await Post.findOne({ _id, author: req.user })
    if (post) {
      if (post.imgURL) {
        unlink(post.imgURL, (error) => error && errorMsg({ error, where: 'deletePost' }));
      }
      await Post.deleteOne({ _id, author: req.user });
      res.status(200).json(null); // truthy objects cause errors as they do not match Models
    }
  } catch (error) {
    errorMsg({ error, where: 'deletePost' });
    res.status(500).json({ message: 'Unable to delete post.' });
  }
};

export { newPost, editPost, deletePost };

import Post from '../models/Post';
import { RequestHandler } from 'express';
import { io } from '../app';
import { getErrors, hasErrors } from '../validation/validators';
import { deleteFile } from '../util/deleteFile';
import captainsLog from '../util/captainsLog';

const newPost: RequestHandler = async (req, res, next) => {
  try {
    const { title, content } = req.body;
    const image = req.file;

    const errors = getErrors(req);
    if (hasErrors(errors)) {
      res.status(422).json(errors);
      if (image) deleteFile(image.path);
      return;
    }

    const post = new Post({ title, content, creator: req.user });
    if (image) post.imgURL = image.path;
    await post.save();
    io.emit('post:update', post); // pushes socket to client
    res.status(201).json(post);
  } catch (error) {
    captainsLog(5, 'newPost Catch', error);
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
      if (image) deleteFile(image.path);
      return;
    }

    const post = await Post.findOne({ _id: postId, creator: req.user });
    if (!post) {
      res.status(404).json({ message: 'Post not found.' });
      return;
    }

    post.title = title;
    post.content = content;
    if (image) {
      if (post.imgURL) deleteFile(post.imgURL);
      post.imgURL = image.path;
    }

    await post.save();
    await post.populate('creator', '-email -password');
    io.emit('post:update', post); // emits to main feed page
    io.emit(`post:${postId}:update`, post); // emits to specfic path only
    res.status(200).json(post);
  } catch (error) {
    captainsLog(5, 'editPost Catch', error);
    res.status(500).json({ message: 'Unable to update your post.' });
  }
};

const deletePost: RequestHandler = async (req, res, next) => {
  try {
    const { postId: _id } = req.params;
    const post = await Post.findOne({ _id, creator: req.user });

    if (!post) {
      res.status(404).json({ message: 'Post not found.' });
      return;
    }

    if (post.imgURL) deleteFile(post.imgURL);
    await Post.deleteOne({ _id, creator: req.user });
    io.emit('post:delete', post); // emits to main feed page
    io.emit(`post:${_id}:delete`, post); // emits to specfic path only
    res.status(200).json(null); // 200 replaces client Data, so post must be null
  } catch (error) {
    captainsLog(5, 'deletePost Catch', error);
    res.status(500).json({ message: 'Unable to delete post.' });
  }
};

export { newPost, editPost, deletePost };

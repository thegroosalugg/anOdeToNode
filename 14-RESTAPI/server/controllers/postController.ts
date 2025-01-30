import Post from '../models/Post';
import { RequestHandler } from 'express';
import { io } from '../app';
import AppError from '../models/Error';
import { getErrors, hasErrors } from '../validation/validators';
import { deleteFile } from '../util/deleteFile';

const devErr = 'Do not use without AuthJWT';

const newPost: RequestHandler = async (req, res, next) => {
  if (!req.user) return next(new AppError(403, ['', 'newPost !req.user'], devErr));

  try {
    const { title, content } = req.body;
    const image = req.file;

    const errors = getErrors(req);
    if (hasErrors(errors)) {
      if (image) deleteFile(image.path);
      return next(new AppError(422, ['', 'newPost errors'], errors));
    }

    const post = new Post({ title, content, creator: req.user._id });
    if (image) post.imgURL = image.path;
    await post.save();
    io.emit('post:update', post); // pushes socket to client
    res.status(201).json(post);
  } catch (error) {
    next(new AppError(500, ['Unable to submit your post', 'newPost catch'], error));
  }
};

const editPost: RequestHandler = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const { title, content } = req.body;
    const image = req.file;

    const errors = getErrors(req);
    if (hasErrors(errors)) {
      if (image) deleteFile(image.path);
      return next(new AppError(422, ['', 'editPost errors'], errors));
    }

    const post = await Post.findOne({ _id: postId, creator: req.user });
    if (!post) return next(new AppError(404, ['Post not found', 'editPost !post']));

    post.title   = title;
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
    next(new AppError(500, ['Unable to update your post', 'editPost catch'], error));
  }
};

const deletePost: RequestHandler = async (req, res, next) => {
  try {
    const { postId: _id } = req.params;
    const post = await Post.findOne({ _id, creator: req.user });
    if (!post) return next(new AppError(404, ['Post not found', 'deletePost !post']));

    if (post.imgURL) deleteFile(post.imgURL);
    await Post.deleteOne({ _id, creator: req.user });
    io.emit('post:delete', post); // emits to main feed page
    io.emit(`post:${_id}:delete`, post); // emits to specfic path only
    res.status(200).json(null); // 200 replaces client Data, so post must be null
  } catch (error) {
    next(new AppError(500, ['Unable to delete your post', 'deletePost catch'], error));
  }
};

export { newPost, editPost, deletePost };

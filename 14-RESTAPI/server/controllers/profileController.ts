import { RequestHandler } from 'express';
import { unlink } from 'fs';
import User from '../models/User';
import Post from '../models/Post';
import errorMsg from '../util/errorMsg';

const getPosts: RequestHandler = async (req, res, next) => {
  try {
    const posts = await Post.find({ author: req.user });
    console.log(posts)
    if (!posts) {
      res.status(404).json({ message: 'Nothing posted yet' });
    }
    res.status(200).json(posts);
  } catch (error) {
    errorMsg({ error, where: 'getPosts' });
    res.status(500).json({ message: 'Failed to fetch posts' });
  };
}

const profilePic: RequestHandler = async (req, res, next) => {
  try {
    const  user = await User.findById(req.user);
    const image = req.file;

    if (!user) {
      res.status(404).json({ message: 'User not found' });
      if (image)
        unlink(image.path, (error) => errorMsg({ error, where: 'profilePic UNLINK' }));
      return;
    }

    if (!image) {
      res.status(422).json({ message: 'Image required' });
      return;
    }

    if (user.imgURL) {
      unlink(
        user.imgURL,
        (error) => error && errorMsg({ error, where: 'profilePic UNLINK' })
      );
    }
    const imgURL = image.path
    user.imgURL  = imgURL;
    await user.save();
    res.status(201).json({ imgURL });
  } catch (error) {
    errorMsg({ error, where: 'profilePic' });
    res.status(500).json({ message: 'Image upload failed ' });
  }
};

export { getPosts, profilePic };

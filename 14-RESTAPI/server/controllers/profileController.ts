import User from '../models/User';
import { RequestHandler } from 'express';
import { deleteFile } from '../util/deleteFile';
import captainsLog from '../util/captainsLog';

const profilePic: RequestHandler = async (req, res, next) => {
  const  user = req.user;
  const image = req.file;
  if (!user) {
    if (image) deleteFile(image.path);
    return next('Do not use without AuthJWT');
  }

  try {
    if (!image) {
      res.status(422).json({ message: 'Image required' });
      return;
    }

    if (user.imgURL) deleteFile(user.imgURL);
    const imgURL = image.path
    user.imgURL  = imgURL;
    await user.save();
    res.status(201).json({ imgURL });
  } catch (error) {
    captainsLog(5, 'profilePic Catch', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
};

export { profilePic };

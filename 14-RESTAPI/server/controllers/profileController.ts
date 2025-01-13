import { RequestHandler } from 'express';
import { unlink } from 'fs';
import User from '../models/User';
import errorMsg from '../util/errorMsg';

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

export { profilePic };

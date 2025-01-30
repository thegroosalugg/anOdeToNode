import { RequestHandler } from 'express';
import AppError from '../models/Error';
import { deleteFile } from '../util/deleteFile';

const devErr = 'Do not use without AuthJWT';

const profilePic: RequestHandler = async (req, res, next) => {
  const  user = req.user;
  const image = req.file;
  if (!user) {
    if (image) deleteFile(image.path);
    return next(new AppError(403, ['', 'profilePic !user'], devErr));
  }

  try {
    if (!image) {
      return next(new AppError(422, ['', 'profilePic !image'], { message: 'Image required' }));
    } // 422 errors send 3rd arg to client instead of 2nd arg [0]

    if (user.imgURL) deleteFile(user.imgURL);
    const imgURL = image.path
    user.imgURL  = imgURL;
    await user.save();
    res.status(201).json({ imgURL });
  } catch (error) {
    next(new AppError(500, ['Image upload failed', 'profilePic catch'], error));
  }
};

export { profilePic };

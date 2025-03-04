import { RequestHandler } from 'express';
import AppError from '../models/Error';
import { deleteFile } from '../util/deleteFile';

const devErr = 'Do not use without AuthJWT';

const setPhoto: RequestHandler = async (req, res, next) => {
  const  user = req.user;
  const image = req.file;
  if (!user) {
    if (image) deleteFile(image.path);
    return next(new AppError(403, 'Something went wrong', devErr));
  }
  if (!image) return next(new AppError(422, { message: 'Image required' }));

  try {
    if (user.imgURL) deleteFile(user.imgURL);
    const imgURL = image.path
    user.imgURL  = imgURL;
    await user.save();
    res.status(201).json({ imgURL });
  } catch (error) {
    next(new AppError(500, 'Image upload failed', error));
  }
};

const updateInfo: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(new AppError(403, 'Something went wrong', devErr));

  try {
    const fields = ['home', 'work', 'study', 'bio'] as const;
    const [key] = Object.keys(req.body) as [typeof fields[number]];

    if (fields.includes(key)) {
      const data = req.body[key];
      user.about[key] = data;
      await user.save();
      res.status(201).json(data);
    } else {
      next(new AppError(422, 'Invalid profile field'));
    }
  } catch (error) {
    next(new AppError(500, 'Unable to update user info', error));
  }
};

export { setPhoto, updateInfo };

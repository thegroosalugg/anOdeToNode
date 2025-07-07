import { RequestHandler } from "express";
import AppError from "../models/Error";
import { IProfile } from "../models/User";
import { getErrors, hasErrors } from "../validation/validators";
import { deleteFile } from "../util/deleteFile";

const setPhoto: RequestHandler = async (req, res, next) => {
  const user = req.user;
  const image = req.file;
  if (!user) {
    if (image) deleteFile(image.path);
    return next(AppError.devErr());
  }
  if (!image) return next(new AppError(422, "Image required"));

  try {
    if (user.imgURL) deleteFile(user.imgURL);
    const imgURL = image.path;
    user.imgURL = imgURL;
    await user.save();
    res.status(201).json({ imgURL });
  } catch (error) {
    next(new AppError(500, "Image upload failed", error));
  }
};

const updateInfo: RequestHandler = async (req, res, next) => {
  const user = req.user;
  if (!user) return next(AppError.devErr());

  try {
    const errors = getErrors(req);
    if (hasErrors(errors)) return next(new AppError(422, errors));
    const { home, study, work, bio } = req.body;

    for (const [key, value] of Object.entries({ home, work, study, bio })) {
      if (value) user.set(`about.${key}`, value);
    }

    await user.save();
    res.status(201).json({ ...user.about });
  } catch (error) {
    next(new AppError(500, "Unable to update user info", error));
  }
};

export { setPhoto, updateInfo };

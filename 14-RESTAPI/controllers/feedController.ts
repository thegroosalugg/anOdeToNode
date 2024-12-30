import { RequestHandler } from "express";

const getPosts: RequestHandler = (req, res, next) => {
  res.status(200).json({ message: 'never mind' });
}

export { getPosts };

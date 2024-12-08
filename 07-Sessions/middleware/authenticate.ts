import { RequestHandler } from "express";

export const authenticate: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  next();
};

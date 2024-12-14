import { RequestHandler } from "express";

const authenticate: RequestHandler = async (req, res, next) => {
  if (!req.user) {
    return res.redirect('/login');
  }
  next();
};

export default authenticate;

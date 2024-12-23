import { RequestHandler } from "express";
import User from "../models/User";
import errorMsg from "../util/errorMsg";

// middleware sets sessions user to req.user for easier access in controllers
const handleSession: RequestHandler = ((req, res, next) => {
  res.locals.user     = null;
  res.locals.errors   = {};
  res.locals.formData = {}; // res.locals all must be explicitly declared each cycle

  if (!req.session.dataRoute) {
    delete req.session.file; // remove saved file on non file handling routes
  }

  if (req.session.dataRoute) {
    req.session.dataRoute = false; // must be set to true only on file handling routes per req
  }

  if (req.session.errors) {
    res.locals.errors = { ...res.locals.errors, ...req.session.errors }; // Merge session errors
    delete req.session.errors; // Clear the session errors
  }

  if (req.session.formData) { // repeat for form data
    res.locals.formData = { ...res.locals.formData, ...req.session.formData };
    delete req.session.formData;
  }

  if (req.session.resetAuth && req.session.resetAuth.expiry < Date.now()) {
    delete req.session.resetAuth; // delete expired password reset token
  }

  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user; // sessions user set for all controller requests
      const { _id, name, email } = user;
      res.locals.user = { _id, name, email }; // locals user set for all EJS responses
      next();
    })
    .catch((error) => {
      errorMsg({ error, where: 'App findById' });
    });
});

export default handleSession;

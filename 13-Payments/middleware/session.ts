import { RequestHandler } from "express";
import User from "../models/User";
import { clearTempFiles } from "../util/fileHelper";
import logger from "../util/logger";

// middleware sets sessions user to req.user for easier access in controllers
const handleSession: RequestHandler = ((req, res, next) => {
  const session   = req.session;
  const locals    = res.locals;
  locals.user     = null;
  locals.errors   = {};
  locals.formData = {}; // res.locals all must be explicitly declared each cycle

  if (!session.dataRoute) {
    if (session.user) clearTempFiles(session.user._id.toString());
    delete session.file; // remove saved file on non file handling routes
  }

  if (session.dataRoute) {
    session.dataRoute = false; // must be set to true only on file handling routes per req
  }

  if (session.errors) {
    locals.errors = { ...locals.errors, ...session.errors }; // Merge session errors
    delete session.errors; // Clear the session errors
  }

  if (session.formData) { // repeat for form data
    locals.formData = { ...locals.formData, ...session.formData };
    delete session.formData;
  }

  if (session.resetAuth && session.resetAuth.expiry < Date.now()) {
    delete session.resetAuth; // delete expired password reset token
  }

  if (!session.user) return next();

  User.findById(session.user._id)
    .then((user) => {
      if (!user) return next();
      req.user = user; // sessions user set for all controller requests
      const { _id, name, email } = user;
      locals.user = { _id, name, email }; // locals user set for all EJS responses
      next();
    })
    .catch((error) => logger(500, { session: error }));
});

export default handleSession;

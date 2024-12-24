import { RequestHandler } from "express";
import crypto from 'crypto';

const csrfShield: RequestHandler = (req, res, next) => {
    const generateToken = () => {
      return crypto.randomBytes(32).toString('hex');
    };

    if (!req.session.csrf) {
      req.session.csrf = generateToken();
    }

    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
      const submittedToken =
        req.body._csrf ||
        req.headers['x-csrf-token'];

      if (!submittedToken || submittedToken !== req.session.csrf) {
        return res.redirect('/404');
      }
    }

    res.locals.csrf = req.session.csrf;
    next();
  };

  export default csrfShield;

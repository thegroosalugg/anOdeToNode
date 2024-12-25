import { RequestHandler } from 'express';
import crypto from 'crypto';

const csrfShield: RequestHandler = async (req, res, next) => {
  const generateToken = () => {
    return crypto.randomBytes(32).toString('hex');
  };

  if (!req.session.csrf) {
    req.session.csrf = generateToken();
  }

  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const submittedToken = req.body._csrf || req.headers['x-csrf-token'];

    if (!submittedToken || submittedToken !== req.session.csrf) {
      const isXHR =
        req.xhr ||
        req.headers.accept?.includes('application/json') ||
        req.headers['x-requested-with'] === 'XMLHttpRequest';

      if (isXHR) {
        res.status(403).json({ error: 'CSRF token validation failed' });
        return;
      } else {
        res.redirect('/404');
        return;
      }
    }
  }

  res.locals.csrf = req.session.csrf;
  next();
};

export default csrfShield;

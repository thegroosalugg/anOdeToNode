import path from 'path';
import express from 'express';
import session from 'express-session';
import adminRoutes from './routes/admin';
import storeRoutes from './routes/store';
import authRoutes from './routes/auth';
import errorController from './controllers/error';
import mongoose from 'mongoose';
import User from './models/User';
import dotenv from 'dotenv';
       dotenv.config();

const inProduction = process.env.NODE_ENV === 'production';

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

app.set('trust proxy', 1); // trust first proxy. Required to work on Render.com
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: inProduction, // prevents client-side JavaScript from accessing the cookie.
        secure: inProduction, // enables cookies over HTTPS only. Can't be used in dev.
      sameSite: 'strict',     // sets cross origin requests
    },
  })
);

// middleware sets sessions user to req.user for easier access in controllers
app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});


// set to public folder in repo root, for all projects
app.use(
  express.static(path.join(import.meta.dirname, '../', 'public'), {
    maxAge: '1d', // Cache static assets for 1 day to improve load times
    etag: false, // Disable ETag generation for simpler cache management
  })
);

// public folder specific to project
app.use(express.static(path.join(import.meta.dirname, 'public')));

app.use('/admin', adminRoutes); // adds URL filter to all routes
app.use(storeRoutes);
app.use(authRoutes);
app.use(errorController);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is on track to port 3000');
    });
  })
  .catch((error) => console.log('Mongoose Error', error));

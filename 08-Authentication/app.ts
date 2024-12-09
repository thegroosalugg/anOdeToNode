import path from 'path';
import express from 'express';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import adminRoutes from './routes/admin';
import storeRoutes from './routes/store';
import authRoutes from './routes/auth';
import errorController from './controllers/error';
import mongoose from 'mongoose';
import User from './models/User';
import dotenv from 'dotenv';
import { authenticate } from './middleware/authenticate';
       dotenv.config();

const inProduction = process.env.NODE_ENV === 'production';

const app = express();

// sets templating engine
app.set('view engine', 'ejs');

// allows parsing of data into req.body with simple key value pairs
app.use(express.urlencoded({ extended: false }));

app.set('trust proxy', 1); // trust first proxy. Required to work on Render.com
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
           serialize: (session) => session, // allows nested object structure in mongo
         unserialize: (data) => data,       // reformats back to app readable format
    }),
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
  res.locals.user = null; // explicitly set as null every cycle to prevent undeclared keys

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
    .catch((err) => {
      console.log('App findById middleware error:', err);
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

app.use('/admin', authenticate, adminRoutes); // adds URL filter to all routes
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

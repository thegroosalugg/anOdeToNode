import path from 'path';
import express from 'express';
import adminRoutes from './routes/admin';
import storeRoutes from './routes/store';
import errorController from './controllers/error';
import User from './models/User';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
       dotenv.config();

const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

// set to public folder in repo root, for all projects
app.use(
  express.static(path.join(import.meta.dirname, '../', 'public'), {
    maxAge: '1d', // Cache static assets for 1 day to improve load times
    etag: false, // Disable ETag generation for simpler cache management
  })
);

// public folder specific to project
app.use(express.static(path.join(import.meta.dirname, 'public')));

app.use((req, res, next) => {
  User.findById('6750df45541bb5fbb4115baf')
    .then((user) => {
      req.user = user;
      // console.log(req.user);
      next();
    })
    .catch((err) => console.log('App.ts findUser error:', err));
});

app.use('/admin', adminRoutes); // adds URL filter to all routes
app.use(storeRoutes);
app.use(errorController);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is on track to port 3000');
    });
  })
  .catch((error) => console.log('Mongoose Error', error));

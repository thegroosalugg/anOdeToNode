import path from 'path';
import express from 'express';
import adminRoutes from './routes/admin';
import storeRoutes from './routes/store';
import errorController from './controllers/error';
import { mongoConnect } from './data/database';
import User from './models/User';

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
  // temp middleware set user to always true so controllers don't need re-writing
  req.user = true as unknown as User;
  next();
});

app.use('/admin', adminRoutes); // adds URL filter to all routes
app.use(storeRoutes);
app.use(errorController);

mongoConnect(() => {
  app.listen(3000, () => {
    console.log('Server is on track to port 3000');
  });
});

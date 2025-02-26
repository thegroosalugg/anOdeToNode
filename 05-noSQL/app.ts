import path from 'path';
import express from 'express';
import adminRoutes from './routes/admin';
import storeRoutes from './routes/store';
import errorController from './controllers/error';
import { mongoConnect } from './data/database';
import User from './models/User';

const app = express();

// set to public folder in repo root, for all projects
app.use(
  express.static(path.join(import.meta.dirname, '../', 'shared'), {
    maxAge: '1d', // Cache static assets for 1 day to improve load times
    etag: false, // Disable ETag generation for simpler cache management
  })
);

// public folder specific to project
app.use(express.static(path.join(import.meta.dirname, 'public')));

// sets templating engine
app.set('view engine', 'ejs');

// allows parsing of data into req.body with simple key value pairs
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  User.findById('674cbcd544c3f6817416b189')
    .then((user) => {
      req.user = new User(user!);
      // console.log(req.user);
      next();
    })
    .catch((err) => console.log('App.ts findUser error:', err));
});

app.use('/admin', adminRoutes); // adds URL filter to all routes
app.use(storeRoutes);
app.use(errorController);

mongoConnect(() => {
  app.listen(3000, () => {
    console.log('Server is on track to port 3000');
  });
});

import path from 'path';
import express from 'express';
import sequelize from './data/database';
import adminRoutes from './routes/admin';
import storeRoutes from './routes/store';
import errorController from './controllers/error';

const app = express();

app.use(express.urlencoded({ extended: false }));

 // allows serving of static paths
app.use(express.static(path.join(import.meta.dirname, '../', 'public'), {
  maxAge: '1d', // Cache static assets for 1 day to improve load times
  etag: false  // Disable ETag generation for simpler cache management
}));

app.use('/admin', adminRoutes); // adds URL filter to all routes
app.use(storeRoutes);
app.use(errorController);

sequelize
  .sync()
  .then((result) => {
    app.listen(3000, () => {
      console.log('Server is on track to port 3000');
    });
  })
  .catch((err) => {
    console.log('Server Error:', err);
  });

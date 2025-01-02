import express from 'express';
import mongoose from 'mongoose';
import { join } from 'path';
import authRoutes from './routes/auth';
import feedRoutes from './routes/feed';
import errorMsg from './util/errorMsg';
import dotenv from 'dotenv';
       dotenv.config();

const app = express();

app.use(express.static(join(import.meta.dirname, 'public'))); // serve static paths

// app.use(express.urlencoded({ extended: false })); // x-www-form-urlencoded <form>
app.use(express.json()); // parse application/json

// allows cross origin requests
app.use((req, res, next) => {
  // sets allowd URLS. * = all
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL!);
  // sets allowed methods
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  // sets allowed headers, content-type for req body
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(authRoutes);
app.use('/feed', feedRoutes);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(3000, () => {
      console.log('Hudson River, 2 years ago');
    });
  })
  .catch((error) => errorMsg({ error, where: 'Mongoose connect'}));

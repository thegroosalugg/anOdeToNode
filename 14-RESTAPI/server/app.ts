import express from 'express';
import { join } from 'path';
import feedRoutes from './routes/feed';
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

app.use('/feed', feedRoutes);

app.listen(3000);

import       express, { ErrorRequestHandler }
                     from 'express';
import      mongoose from 'mongoose';
import        multer from 'multer';
import {   Server  } from 'socket.io';
import {    join   } from 'path';
import {
         storage,
        fileFilter
                   } from './middleware/multerConfig';
import {   authJWT } from './middleware/auth.JWT';
import    authRoutes from './routes/auth';
import    postRoutes from './routes/post';
import    feedRoutes from './routes/feed';
import   replyRoutes from './routes/reply';
import profileRoutes from './routes/profile';
import  socialRoutes from './routes/social';
import   alertRoutes from './routes/alert';
import   captainsLog from './util/captainsLog';
import        dotenv from 'dotenv';
              dotenv.config();

const    app = express();
const server = app.listen(3000, () => {
  captainsLog(7, 'Hudson River, 2 years ago');
}); // createNewServer

export const io = new Server(server, {
  cors: {
            origin: process.env.CLIENT_URL,
           methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
}); // set up websockets. CORS applies only to sockets, not regular HTTP

app.use('/uploads', express.static(join(import.meta.dirname, 'uploads'))); // serve static paths

// app.use(express.urlencoded({ extended: false })); // x-www-form-urlencoded <form>
app.use(express.json()); // parse application/json
app.use(multer({ storage, fileFilter }).single('image')); // multipart/form-data

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

app.use(                        authRoutes);
app.use('/feed',    authJWT,    feedRoutes);
app.use('/post',    authJWT,   [postRoutes, replyRoutes]);
app.use('/profile', authJWT, profileRoutes);
app.use('/social',  authJWT,  socialRoutes);
app.use('/alert',   authJWT,   alertRoutes);

app.use(((appError, req, res, next) => {
  const { status, message, dev, error } = appError;
    captainsLog(3, `[status: ${status}] :::${dev}:::`, error);
    res.status(status).json({ message });
}) as ErrorRequestHandler);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    io.on('connection', (socket) => {
      captainsLog(2, 'App IO: Client connected');

      socket.on('disconnect', () => {
        captainsLog(1, 'App IO: Client disconnected');
      });
    });
  })
  .catch((error) => captainsLog(1, 'Mongoose error', error));

import       express, { ErrorRequestHandler }
                     from 'express';
import      mongoose from 'mongoose';
import        multer from 'multer';
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
import    chatRoutes from './routes/chat';
import     msgRoutes from './routes/message';
import   alertRoutes from './routes/alert';
import   captainsLog from './util/captainsLog';
import        socket from './socket';
import        dotenv from 'dotenv';
              dotenv.config();

// re-route FS location to parent folder in production
const rootDir = process.env.NODE_ENV === 'production' ? '../' : '';

const app = express();

// serve static paths
app.use('/uploads', express.static(join(import.meta.dirname, rootDir, 'uploads')));

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
app.use('/chat',    authJWT,   [chatRoutes,   msgRoutes]);
app.use('/alerts',  authJWT,   alertRoutes);

app.use(((appError, req, res, next) => {
  const { status, client, dev, where } = appError;
    captainsLog(status, `[status: ${status}] :::${where}:::`, [client, dev]);
    res.status(status).json(client);
}) as ErrorRequestHandler);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    const server = app.listen(3000);
    socket.init(server);
    captainsLog(0, '<<Hudson River, 2 years ago>>');
  })
  .catch((error) => captainsLog(403, '<<Mongoose error>>', error));

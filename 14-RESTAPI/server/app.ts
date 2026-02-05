import { EXTERNAL_URL, CLIENT_URL, MONGO_URI, NODE_ENV } from './envs'; // must run first
import express, { ErrorRequestHandler } from 'express';
import      mongoose     from 'mongoose';
import        multer     from 'multer';
import {      join     } from 'path';
import { storage, fileFilter } from './middleware/multerConfig';
import {     authJWT   } from './middleware/auth.JWT';
import { postAnalytics } from './controllers/analyticsController';
import      authRoutes   from './routes/auth';
import      postRoutes   from './routes/post';
import      feedRoutes   from './routes/feed';
import     replyRoutes   from './routes/reply';
import   profileRoutes   from './routes/profile';
import    socialRoutes   from './routes/social';
import      chatRoutes   from './routes/chat';
import       msgRoutes   from './routes/message';
import     alertRoutes   from './routes/alert';
import     captainsLog   from './util/captainsLog';
import          socket   from './socket';

// re-route FS location to parent folder in production
const rootDir = NODE_ENV === 'production' ? '../' : ''

const app = express();

// serve static paths
app.use('/uploads', express.static(join(import.meta.dirname, rootDir, 'uploads')));

// app.use(express.urlencoded({ extended: false })); // x-www-form-urlencoded <form>
app.use(express.json()); // parse application/json
app.use(multer({ storage, fileFilter }).single('image')); // multipart/form-data

const allowedOrigins = [CLIENT_URL, EXTERNAL_URL];

// allows cross origin requests
app.use((req, res, next) => {
  // sets allowd URLS. * = all
  const origin = req.headers.origin;
  if (origin && allowedOrigins.includes(origin)) {
    // allow multiple ENV origins
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  // sets allowed methods
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
  // sets allowed headers, content-type for req body
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.post('/analytics',       postAnalytics);
app.use(                        authRoutes);
app.use('/feed',    authJWT,    feedRoutes);
app.use('/post',    authJWT,   [postRoutes, replyRoutes]);
app.use('/profile', authJWT, profileRoutes);
app.use('/social',  authJWT,  socialRoutes);
app.use('/chat',    authJWT,   [chatRoutes,   msgRoutes]);
app.use('/alerts',  authJWT,   alertRoutes);

app.use(((appError, req, res, next) => {
  const { status, response, log } = appError
  if (!log) delete appError.log
  captainsLog(status, appError)
  res.status(status).json(response)
}) as ErrorRequestHandler)

mongoose
  .connect(MONGO_URI)
  .then(() => {
    const port = 3000
    const server = app.listen(port)
    socket.init(server)
    captainsLog(0, { server: true, port, environment: NODE_ENV })
  })
  .catch((error) => captainsLog(400, { mongoose: error }))

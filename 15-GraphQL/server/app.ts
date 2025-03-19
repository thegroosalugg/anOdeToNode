import express,
{ ErrorRequestHandler, RequestHandler } from 'express';
import {      storage, fileFilter     } from './middleware/multerConfig';
import {          ApolloServer        } from '@apollo/server';
import {       expressMiddleware      } from '@apollo/server/express4';
import      mongoose from 'mongoose';
import        multer from 'multer';
import {   Server  } from 'socket.io';
import {    join   } from 'path';
import {   authJWT } from './middleware/auth.JWT';
import {  typeDefs } from './graphQL/schemas/authSchema';
import { resolvers } from './graphQL/resolvers/authResolver';
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
import        dotenv from 'dotenv';
              dotenv.config();

// re-route FS location to parent folder in production
const rootDir = process.env.NODE_ENV === 'production' ? '../' : '';

const    app = express();
const server = app.listen(3000, () => {
  captainsLog(0, '<<Hudson River, 2 years ago>>');
}); // createNewServer

export const io = new Server(server, {
  cors: {
            origin: process.env.CLIENT_URL,
           methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }
}); // set up websockets. CORS applies only to sockets, not regular HTTP

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

// Create an ApolloServer instance with the provided schema (typeDefs) and resolvers
const apolloServer = new ApolloServer({ typeDefs, resolvers });
// Start the Apollo Server to begin accepting reqs with top level await
await apolloServer.start();
// Set up the '/graphql' route to handle incoming GraphQL requests
app.use('/graphql', expressMiddleware(apolloServer, {
  // Pass 'req' into context config Fn, used for auth or other req data
  context: async ({ req }) => ({ req })
}));
// @types/express": "^4.17.21" DevDepedency manually installed to fix tpype mismatch with Apollo

captainsLog(200, "GraphQL resolver test:" + resolvers.Query.hello());

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
    io.on('connection', (socket) => {
      captainsLog(200, '<App IO: <Client connected>>');

      socket.on('disconnect', () => {
        captainsLog(403, '<App IO: <Client disconnected>>');
      });
    });
  })
  .catch((error) => captainsLog(403, '<<Mongoose error>>', error));

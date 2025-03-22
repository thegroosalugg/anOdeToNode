import express,
       { ErrorRequestHandler } from 'express';
import { storage, fileFilter } from './middleware/multerConfig';
import {     ApolloServer    } from '@apollo/server';
import {  expressMiddleware  } from '@apollo/server/express4';
import { typeDefs, resolvers } from './graphQL';
import         mongoose        from 'mongoose';
import          multer         from 'multer';
import {         join        } from 'path';
import       captainsLog       from './util/captainsLog';
import          dotenv         from 'dotenv';
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
  if (req.method === 'OPTIONS') return res.sendStatus(200); // graphQL
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

app.use(((appError, req, res, next) => {
  const { status, client, dev, where } = appError;
    captainsLog(status, `[status: ${status}] :::${where}:::`, [client, dev]);
    res.status(status).json(client);
}) as ErrorRequestHandler);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => app.listen(3000, () => captainsLog(0, '<<Hudson River, 2 years ago>>')))
  .catch((error) => captainsLog(403, '<<Mongoose error>>', error));

import express,
  { ErrorRequestHandler }
                     from 'express';
import          path from 'path';
import       session from 'express-session';
import      mongoose from 'mongoose';
import    MongoStore from 'connect-mongo';
import    authRoutes from './routes/auth';
import   adminRoutes from './routes/admin';
import   storeRoutes from './routes/store';
import {
         error404,
         error500
                   } from './controllers/error';
import    csrfShield from './middleware/csrf';
import handleSession from './middleware/session';
import  authenticate from './middleware/authenticate';
import      errorMsg from './util/errorMsg';
import        dotenv from 'dotenv';
              dotenv.config();

const inProduction = process.env.NODE_ENV === 'production';
const app = express();

// sets templating engine
app.set('view engine', 'ejs');

// allows parsing of data into req.body with simple key value pairs
app.use(express.urlencoded({ extended: false }));

app.set('trust proxy', 1); // trust first proxy. Required to work on Render.com
app.use(
  session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
           serialize: (session) => session, // allows nested object structure in mongo
         unserialize: (data) => data,       // reformats back to app readable format
    }),
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000,
      httpOnly: inProduction, // prevents client-side JavaScript from accessing the cookie.
        secure: inProduction, // enables cookies over HTTPS only. Can't be used in dev.
      sameSite: 'strict',     // sets cross origin requests
    },
  })
);

app.use(csrfShield); // protects sessions from request forgery via tokens. Initialise after sessions
app.use(handleSession); // handles sessions data on each cycle

// set to public folder in repo root, for all projects
app.use(
  express.static(path.join(import.meta.dirname, '../', 'public'), {
    maxAge: '1d', // Cache static assets for 1 day to improve load times
    etag: false, // Disable ETag generation for simpler cache management
  })
);

// public folder specific to project
app.use(express.static(path.join(import.meta.dirname, 'public')));

app.use('/admin', authenticate, adminRoutes); // adds URL filter to all routes
app.use(storeRoutes);
app.use(authRoutes);
app.get('/500', error500); // 500 errors route - must be defined before the get all errors route
app.use(error404); // will catch all other URLS, defined last
// special 4 arg middleware that will catch next(withArgument)
app.use(((error, req, res, next) => res.redirect('/500')) as ErrorRequestHandler);

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(3000, () => {
      console.log('Server is on track to port 3000');
    });
  })
  .catch((error) => errorMsg({ error, where: 'Mongoose connect'}));

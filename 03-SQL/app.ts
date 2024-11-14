import path from 'path';
import express from 'express';
import sqlite3 from 'sqlite3';
import adminRoutes from './routes/admin';
import storeRoutes from './routes/store';
import errorController from './controllers/error';

const app = express();
const db = new sqlite3.Database('./data/mountain.db');

// better-sqlite3: uses .prepare(), .all(), .get(), .run()
//        sqlite3: uses    .each(), .all(), .get(), .run()
db.all('SELECT * FROM items', (err, items) => {
  if (err) {
    console.error('Error reading data from the database:', err);
    return;
  }
  console.log(items);
});

app.use(express.urlencoded({ extended: false })); // replaces bodyparser.urlencoded

 // allows serving of static paths
app.use(express.static(path.join(import.meta.dirname, '../', 'public'), {
  maxAge: '1d', // Cache static assets for 1 day to improve load times
  etag: false  // Disable ETag generation for simpler cache management
}));

app.use('/admin', adminRoutes); // adds URL filter to all routes
app.use(storeRoutes);

app.use(errorController);

// express's app.listen consumes of http.createServer(app); & server.listen()
app.listen(3000, () => {
  console.log('Server is on track to port 3000');
});

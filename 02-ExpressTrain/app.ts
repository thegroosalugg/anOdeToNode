import path from 'path';
import express from 'express';
import adminRoutes from './routes/admin';
import stationRoutes from './routes/station';
import errorController from './controllers/error';
import { getDirname } from './util/getDirname';

const app = express();

app.use(express.urlencoded({ extended: false })); // replaces bodyparser.urlencoded
app.use(express.static(path.join(getDirname(), 'public'))); // allows serving of static paths

app.use('/express', adminRoutes); // adds URL filter to all routes
app.use(stationRoutes);

app.use(errorController);

// express's app.listen consumes of http.createServer(app); & server.listen()
app.listen(3000, () => {
  console.clear();
  console.log('Server is on track to port 3000');
});

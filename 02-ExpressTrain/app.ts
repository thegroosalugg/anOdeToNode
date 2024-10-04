import express from 'express';
import adminRoutes from './routes/admin';
import stationRoutes from './routes/station';
import html from './pages';
import { error, errorCSS } from './pages/error';

const app = express();

// replaces bodyparser.urlencoded
app.use(express.urlencoded({ extended: false }));

app.use('/express', adminRoutes); // adds URL filter to all routes
app.use(stationRoutes);

app.use((req, res, next) => {
  res.status(404).send(html(errorCSS, error));
});

// express's app.listen consumes of http.createServer(app); & server.listen()
app.listen(3000, () => {
  console.log('Server is on track to port 3000');
});

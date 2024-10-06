import express from 'express';
import { router as adminRoutes } from './routes/admin';
import stationRoutes from './routes/station';
import html from './views';
import { error, errorCSS } from './views/error';

console.clear();

const app = express();

// replaces bodyparser.urlencoded
app.use(express.urlencoded({ extended: false }));

app.use('/express', adminRoutes); // adds URL filter to all routes
app.use(stationRoutes);

app.use((req, res, next) => {
  res.status(404).send(html({ css: errorCSS, content: error }));
});

// express's app.listen consumes of http.createServer(app); & server.listen()
app.listen(3000, () => {
  console.log('Server is on track to port 3000');
});

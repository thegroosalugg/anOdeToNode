import express from 'express';
import adminRoutes from './routes/admin'
import stationRoutes from './routes/station'

const app = express();

// replaces bodyparser.urlencoded
app.use(express.urlencoded({ extended: false }));

app.use(adminRoutes);
app.use(stationRoutes);

// express's app.listen consumes of http.createServer(app); & server.listen()
app.listen(3000, () => {
  console.log('Server is on track to port 3000');
});

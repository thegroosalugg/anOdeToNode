import path from 'path';
import express from 'express';
import adminRoutes from './routes/admin';
import shopRoutes from './routes/shop';
import errorController from './controllers/error';

const app = express();

app.use(express.urlencoded({ extended: false })); // replaces bodyparser.urlencoded
app.use(express.static(path.join(import.meta.dirname, 'public'))); // allows serving of static paths

app.use('/admin', adminRoutes); // adds URL filter to all routes
app.use(shopRoutes);

app.use(errorController);

// express's app.listen consumes of http.createServer(app); & server.listen()
app.listen(3000, () => {
  console.log('Server is on track to port 3000');
});

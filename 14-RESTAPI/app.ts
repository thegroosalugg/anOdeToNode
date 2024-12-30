import express from "express";
import { join } from "path";
import feedRoutes from './routes/feed'

const app = express();

app.use(express.static(join(import.meta.dirname, 'public'))); // serve static paths
// app.use(express.urlencoded({ extended: false })); // x-www-form-urlencoded <form>
app.use(express.json()); // parse application/json

app.use('/feed', feedRoutes);

app.listen(8080);

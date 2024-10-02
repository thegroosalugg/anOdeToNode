import http from 'http';
import express from 'express';

const app = express();

app.use((req, res, next) => {
  console.log('middleware one');
  next();
});

app.use((req, res, next) => {
  console.log('middleware two');
  res.send('<h1>all aboard the express train 🚂</h1>')
});

const server = http.createServer(app);

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

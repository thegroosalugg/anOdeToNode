import http from 'http';

const server = http.createServer((req, res) => {
  res.end('all aboard the express train 🚂')
})

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

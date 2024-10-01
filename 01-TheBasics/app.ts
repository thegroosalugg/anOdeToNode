// const http = require('http'); // Using 'require' is common in older Node.js code. Modern ES6+ syntax uses 'import' for module loading.
import http from 'http';
import routes from './routes';

const server = http.createServer(routes)

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

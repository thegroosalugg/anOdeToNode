// const http = require('http'); // Using 'require' is common in older Node.js code. Modern ES6+ syntax uses 'import' for module loading.
import http, { IncomingMessage, ServerResponse } from 'http';

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  console.log(req);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  res.end('Hello World\n');
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

// const http = require('http'); // Using 'require' is common in older Node.js code. Modern ES6+ syntax uses 'import' for module loading.
import http, { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';

const css = `
body {
  display: flex;
  background: linear-gradient(to right, #3a7bd5, #3a6073);
}
main {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #FFFFFF;
}
img {
  width: 250px;
}`;

const html = `
<html>
  <head>
    <title>The Basics</title>
    <style>${css}</style>
  </head>
  <body>
    <main>
      <h1>The Basics</h1>
      <p>HTML supplied by Node</p>
      <img src='/nodejs.png' alt='Node JS icon' />
    </main>
  </body>
</html>`;

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const { url } = req;

  // Serve static files
  if (url === '/nodejs.png') {
    const filePath = path.join(__dirname, 'nodejs.png');
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        res.end('404 Not Found');
        return;
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'image/png');
      res.end(data);
    });
  } else if (url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(html);
  } else {
    res.statusCode = 404;
    res.end('404 Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

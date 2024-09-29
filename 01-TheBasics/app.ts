// const http = require('http'); // Using 'require' is common in older Node.js code. Modern ES6+ syntax uses 'import' for module loading.
import http, { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';
import page from './page';

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const { url, method } = req;

  const ext = path.extname(url || ''); // extracts extension name from url
  const isImage = ['.png', '.jpeg', '.jpg'].includes(ext);

  // Serve static files
  if (url && isImage) {
    const filePath = path.join(__dirname, url);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.statusCode = 404;
        return res.end('404 Not Found');
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', `image/${ext.slice(1)}`); // will return image/jpeg, image/png etc.
      res.end(data);
    });
  } else if (url === '/') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end(page(0));
  } else if (url === '/message' && method === 'POST') {
    const pathname = path.join(
      __dirname, // current directory
     'messages', // subfolder in current dir
     new Date().toISOString().replace(/[:.]/g, '-') + '.txt' // filename: unique by date, ':' & '.' replaced with '-'
    );
    fs.writeFileSync(pathname, 'stuff');
    res.statusCode = 302;
    res.setHeader('Location', '/');
    res.end();
  } else {
    res.statusCode = 404;
    res.end(page(1));
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

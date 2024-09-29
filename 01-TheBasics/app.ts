// const http = require('http'); // Using 'require' is common in older Node.js code. Modern ES6+ syntax uses 'import' for module loading.
import http, { IncomingMessage, ServerResponse } from 'http';
import fs from 'fs';
import path from 'path';
import page from './page';

const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  const { url, method } = req;

  const     ext = path.extname(url || ''); // extracts extension name from url
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
    const body: Buffer[] = [];
    req.on('data', (chunk: Buffer) => {
      body.push(chunk); // pushes data chunks into array as the come
    });
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString(); // concatenate the buffer array to a string of key/value pair
      const    message = parsedBody.split('=')[1]; // split string into an array at the '=' operator and access the value element [1]
      const   pathname = path.join(
        __dirname, // current directory
        'messages', // subfolder in current dir
        new Date().toISOString().replace(/[:.]/g, '-') + '.txt' // filename: unique by date, ':' & '.' replaced with '-'
      );
      fs.writeFileSync(pathname, message);
      res.statusCode = 302;
      res.setHeader('Location', '/'); // redirects
      res.end();
    })
  } else {
    res.statusCode = 404;
    res.end(page(1));
  }
});

server.listen(3000, () => {
  console.log('Server is listening on port 3000');
});

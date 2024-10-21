// How to get filepath in Common JS
const path = require('path');

// finds the location of the file we want to read
// path.join writes the directory of the file's location in the project folder structure
// path.dirname(require.main.filename) returns the path of the main module that started the application
const filePath = path.join(
  path.dirname(require?.main?.filename || process.cwd()), // app/ts root dir
  'data', // data folder, sibling of app.ts
  'items.json' // filename we want to read
);

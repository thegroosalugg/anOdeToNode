import fs from 'fs';
import path from 'path';

// finds the location of the file we want to read
// path.join writes the directory of the file's location in the project folder structure
// path.dirname(require.main.filename) returns the path of the main module that started the application
const filePath = path.join(
  path.dirname(require?.main?.filename || process.cwd()), // app/ts root dir
  'data', // data folder, sibling of app.ts
  'stations.json' // filename we want to read
);

type callbackFn = (stations: Station[]) => void;

function readJSONFile(callback: callbackFn) {
  // utf8 converts data Buffer to string format so it can be parsed
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      callback([]);
    } else {
      callback(JSON.parse(data));
    }
  });
}
class Station {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  save() {
    readJSONFile((stations) => {
      stations.push(this); // save new class instance to array
      fs.writeFile(filePath, JSON.stringify(stations), (err) => {
        console.log(err);
      });
    });
  }

  // static allows function to be called on the Model itself, rathen than an object instance
  static fetchAll(callback: callbackFn) {
    readJSONFile(callback);
  }
}

export default Station;

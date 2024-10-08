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
class Station {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  save() {
    fs.readFile(filePath, 'utf8', (err, data) => {
      // utf8 converts data Buffer to string formate so it can be parsed
      let stations = []; // create file if it doesn't exist
      if (!err) {
        // if no error when reading file, reasign stations to parsed json content
        stations = JSON.parse(data);
      }
      stations.push(this); // save new class instance to array
      fs.writeFile(filePath, JSON.stringify(stations), (err) => {
        // write file to JSON as string. Either existing readFile, or save new declared with 'let'
        console.log(err);
      });
    });
  }

  // static allows function to be called on the Model itself, rathen than an object instance
  static fetchAll(callback: (stations: Station[]) => void) {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        callback([]);
      }
      callback(JSON.parse(data));
    });
  }
}

export default Station;

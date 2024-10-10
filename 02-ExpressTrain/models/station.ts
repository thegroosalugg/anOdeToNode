import fs from 'fs';
import { join } from 'path';

const filePath = join(process.cwd(), 'data', 'stations.json');

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

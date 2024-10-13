import fs from 'fs';
import { join } from 'path';

const filePath = join(import.meta.dirname, '../', 'data', 'boards.json');

type callbackFn = (boards: Board[]) => void;

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

class Board {
    name: string;
    desc: string;
  imgURL: string;
   value: number;

  constructor(name: string, desc: string, imgURL: string, value: number) {
    this.name   = name;
    this.desc   = desc;
    this.imgURL = imgURL;
    this.value  = value;
  }

  save() {
    readJSONFile((boards) => {
      boards.push(this); // save new class instance to array
      fs.writeFile(filePath, JSON.stringify(boards), (err) => {
        console.log(err);
      });
    });
  }

  // static allows function to be called on the Model itself, rathen than an object instance
  static fetchAll(callback: callbackFn) {
    readJSONFile(callback);
  }
}

export default Board;

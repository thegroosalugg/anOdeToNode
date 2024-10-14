import fs from 'fs';
import { join } from 'path';

const filePath = join(import.meta.dirname, '../', 'data', 'items.json');

type callbackFn = (items: Item[]) => void;

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

class Item {
      id: string;
    name: string;
    desc: string;
  imgURL: string;
   price: number;

  constructor(name: string, desc: string, imgURL: string, price: number) {
    this.id     = 'SB' + Math.floor(Math.random() * 100000)
    this.name   = name;
    this.desc   = desc;
    this.imgURL = imgURL;
    this.price  = price;
  }

  save() {
    readJSONFile((items) => {
      items.push(this); // save new class instance to array
      fs.writeFile(filePath, JSON.stringify(items), (err) => {
        console.log(err);
      });
    });
  }

  // static allows function to be called on the Model itself, rathen than an object instance
  static fetchAll(callback: callbackFn) {
    readJSONFile(callback);
  }
}

export default Item;

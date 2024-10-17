import fs from 'fs';
import { join } from 'path';
import readJSONFile from '../util/readJSONfile';

const filePath = join(import.meta.dirname, '../', 'data', 'items.json');
export default class Item {
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
    readJSONFile(filePath, (items) => {
      items.push(this); // save new class instance to array
      fs.writeFile(filePath, JSON.stringify(items), (err) => {
        console.log(err);
      });
    });
  }

  // static allows function to be called on the Model itself, rathen than an object instance
  static fetchAll(callback: (items: Item[]) => void) {
    readJSONFile(filePath, callback);
  }

  static findById(paramsId: string, callback: (item: Item | undefined) => void) {
    readJSONFile<Item>(filePath, (items) => {
      const item = items.find(({ id }) => id === paramsId);
      callback(item);
    })
  }
}

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

  constructor(name: string, desc: string, imgURL: string, price: number, id?: string) {
    this.id     = id || 'SB' + Math.floor(Math.random() * 100000) // update existing item if ID passed, or create new
    this.name   = name;
    this.desc   = desc;
    this.imgURL = imgURL;
    this.price  = +price.toFixed(2);
  }

  save() {
    readJSONFile<Item>(filePath, (items) => {
      const index = items.findIndex(item => item.id === this.id)

      if (index !== -1) {
        items[index] = this; // overwrite existing item
      } else {
        items.push(this); // save new class instance to array
      }

      fs.writeFile(filePath, JSON.stringify(items), (err) => {
        console.log(err);
      });
    });
  }

  // static allows function to be called on the Model itself, rathen than an object instance
  static fetchAll(callback: (items: Item[]) => void) {
    readJSONFile(filePath, callback);
  }

  static findById(itemId: string, callback: (item: Item | undefined) => void) {
    readJSONFile<Item>(filePath, (items) => {
      const item = items.find(({ id }) => id === itemId);
      callback(item);
    })
  }

  static deleteItem(itemId: string) {
    readJSONFile<Item>(filePath, (items) => {
      const updatedItems = items.filter(({ id }) => id !== itemId);

      fs.writeFile(filePath, JSON.stringify(updatedItems), (err) => {
        console.log(err);
      });
    })
  }
}

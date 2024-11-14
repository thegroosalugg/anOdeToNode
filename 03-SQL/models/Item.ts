import sqlite3 from 'sqlite3';
const db = new sqlite3.Database('./data/mountain.db');
// better-sqlite3: uses .prepare(), .all(), .get(), .run()
//        sqlite3: uses    .each(), .all(), .get(), .run()

export default class Item {
      id: number;
    name: string;
    desc: string;
  imgURL: string;
   price: number;

  constructor(name: string, desc: string, imgURL: string, price: number, id?: number) {
    this.id     = id || Math.floor(Math.random() * 100000) // update existing item if ID passed, or create new
    this.name   = name;
    this.desc   = desc;
    this.imgURL = imgURL;
    this.price  = +price.toFixed(2);
  }

  save() {

  }

  static fetchAll(callback: (items: Item[]) => void) {
    db.all('SELECT * FROM items', (err, items: Item[]) => {
      if (err) {
        console.error('Class Item/FetchAll Error:', err);
        callback([]);
      } else {
        callback(items);
      }
    });
  }

  static findById(id: number, callback: (item: Item | undefined) => void) {
    db.get('SELECT * FROM items WHERE id = ?', id, (err, item: Item) => {
      if (err)  console.error('Class Item/findById Error:', err);
      callback(item);
    });
  }

  static deleteItem(itemId: string) {

  }
}

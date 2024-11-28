import { getDb } from "../data/database";

export default class Item {
    name: string;
    desc: string;
  imgURL: string;
   price: number;

  constructor(name: string, desc: string, imgURL: string, price: number) {
    this.name   = name;
    this.desc   = desc;
    this.imgURL = imgURL;
    this.price  = +price.toFixed(2);
  }

  save() {
    const db = getDb();
    return db
      .collection('items')
      .insertOne(this)
      .then((result) => console.log('Item Saved', result))
      .catch((err) => console.log('Item Save Error', err));
  }
}

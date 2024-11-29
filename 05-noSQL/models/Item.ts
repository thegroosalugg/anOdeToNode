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

  async save() {
    const db = getDb();
    try {
      await db.collection('items').insertOne(this);
    } catch (error) {
      console.log('Item Save Error', error);
    }
  }

  static async fetchAll() {
    const db = getDb();
    try {
      return await db.collection('items').find().toArray();
    } catch (error) {
      console.log('Item Save Error', error);
    }
  }
}

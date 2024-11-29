import { getDb } from "../data/database";
import { ObjectId } from "mongodb";

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
      console.log('Item fetchAll Error', error);
    }
  }

  static async findById(itemId: string) {
    if (!ObjectId.isValid(itemId)) return null; // immediately cancels function when invalid URL entered
    const _id = new ObjectId(itemId); // convert stringId to Mongo ObjectId
    const db = getDb();
    try {
      return await db.collection('items').find({ _id }).next();
    } catch (error) {
      console.log('Item findById Error', error);
    }
  }
}

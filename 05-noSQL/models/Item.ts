import { getDb } from "../data/database";
import { ObjectId } from "mongodb";

export default class Item {
       name: string;
       desc: string;
     imgURL: string;
      price: number;
  quantity?: number;
       _id?: ObjectId;
    userId?: ObjectId;

  constructor({
      name,
      desc,
    imgURL,
     price,
       _id,
    userId,
  }: {
       name: string;
       desc: string;
     imgURL: string;
      price: number;
       _id?: string;
    userId?: ObjectId;
  }) {
    this.name   = name;
    this.desc   = desc;
    this.imgURL = imgURL;
    this.price  = +price.toFixed(2);
    if (   _id) this._id    = new ObjectId(_id);
    if (userId) this.userId = userId;
  }
  async save() {
    const db = getDb().collection('items');
    let query;

    if (this._id) {
      const { name, desc, imgURL, price } = this;
      query = db.updateOne({ _id: this._id }, { $set: { name, desc, imgURL, price } });
    } else {
      query = db.insertOne(this);
    }

    try {
      await query;
    } catch (error) {
      console.log('Item Save Error', error);
    }
  }

  static async fetchAll() {
    const db = getDb();
    try {
      return await db.collection<Item>('items').find().toArray();
    } catch (error) {
      console.log('Item fetchAll Error', error);
    }
  }

  static async findById(itemId: string) {
    if (!ObjectId.isValid(itemId)) return null; // immediately cancels function when invalid URL entered
    const _id = new ObjectId(itemId); // convert stringId to Mongo ObjectId
    const db = getDb();
    try {
      // find returns a 'cursor' and next fetches a single result & transforms it into a JS object
      return await db.collection<Item>('items').find({ _id }).next();
    } catch (error) {
      console.log('Item findById Error', error);
    }
  }

  static async delete(itemId: string) {
    const _id = new ObjectId(itemId);
    const db = getDb();
    try {
      db.collection('items').deleteOne({ _id })
    } catch (error) {
      console.log('Item delete Error', error);
    }
  }
}

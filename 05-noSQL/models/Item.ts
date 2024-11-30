import { getDb } from "../data/database";
import { ObjectId } from "mongodb";

export default class Item {
    name: string;
    desc: string;
  imgURL: string;
   price: number;
    _id?: ObjectId;

  constructor(name: string, desc: string, imgURL: string, price: number, _id?: string) {
    this.name   = name;
    this.desc   = desc;
    this.imgURL = imgURL;
    this.price  = +price.toFixed(2);
    if (_id) this._id = new ObjectId(_id);
  }

  async save() {
    const db = getDb().collection('items');
    let query;

    if (this._id) {
      query = db.updateOne({ _id: this._id }, { $set: this });
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

import { ObjectId } from "mongodb";
import { getDb } from "../data/database";

export default class User {
   _id?: ObjectId; // taken care of by Mongo. Explicitly added to handle server requests
   name: string;
  email: string;

  constructor(name: string, email: string) {
    this.name  = name;
    this.email = email;
  }

  async save() {
    const db = getDb();
    try {
      await db.collection('users').insertOne(this);
    } catch (error) {
      console.log('User Save Error', error);
    }
  }

  static async findById(userId: string) {
    if (!ObjectId.isValid(userId)) return null; // immediately cancels function when invalid URL entered
    const _id = new ObjectId(userId); // convert stringId to Mongo ObjectId
    const db = getDb();
    try {
      return await db.collection<User>('users').findOne({ _id });
    } catch (error) {
      console.log('User findById Error', error);
    }
  }
}

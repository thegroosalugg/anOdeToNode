import { ObjectId } from "npm:mongodb@6.1.0";
import { getDb } from '../db/db_client.ts';

const success = true;

export default class Msg {
  text: string;
  _id?: ObjectId;

  constructor(text: string, _id?: string) {
    this.text = text;
    if (_id) this._id = new ObjectId(_id);
  }

  private static connect() {
    return getDb().collection('msgs');
  }

  static async getAll() {
    try {
      const db = Msg.connect();
      return (await db.find().toArray()).reverse(); // newest first
    } catch (error) {
      throw { error, status: 404, message: 'failed to fetch messages' };
    }
  }

  async save() {
    const db = Msg.connect();
    let query;
    const { _id, text } = this;

    if (_id) query = db.updateOne({ _id }, { $set: { text } });
    else     query = db.insertOne(this);

    try {
      await query;
      return { success, ...this }
    } catch (error) {
      throw { error, status: 500, message: 'Saving failed' };
    }
  }

  static async delete(msgId: string) {
    const db = Msg.connect();
    const _id = new ObjectId(msgId);
    try {
      await db.deleteOne({ _id });
      return { success }
    } catch (error) {
      throw { error, status: 500, message: 'Deletion failed' };
    }
  }
}

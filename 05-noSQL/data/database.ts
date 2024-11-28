import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

let _db: Db | undefined;;

const mongoConnect = (callback: () => void) => {
  MongoClient.connect(process.env.MONGO_URI!)
    .then((client) => {
      console.log('Mongo Connected');
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log('Mongo Error:', err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'no database found';
}

export { mongoConnect, getDb };

import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const mongoConnect = (callback: (client: MongoClient) => void) => {
  MongoClient.connect(process.env.MONGO_URI!)
    .then((client) => {
      console.log('Mongo Connected');
      callback(client);
    })
    .catch((err) => console.log('Mongo Error:', err));
};

export default mongoConnect;

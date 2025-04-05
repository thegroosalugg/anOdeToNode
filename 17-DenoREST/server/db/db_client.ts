import { MongoClient, Db } from 'npm:mongodb@6.1.0';

let db: Db;

export async function connect() {
  const client = new MongoClient(Deno.env.get('MONGO_URI')!);
  await client.connect();
  db = client.db('deno');
  console.log('MONGO CONNECTED');
}

export const getDb = () => db;

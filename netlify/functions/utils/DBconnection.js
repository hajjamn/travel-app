import { MongoClient } from 'mongodb';

const mongodbUri = process.env.MONGODB_URI;

let cachedDb = null;

export async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    const client = new MongoClient(mongodbUri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db('travel-app');
    cachedDb = db;
    return db;
}

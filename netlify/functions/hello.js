require('dotenv').config()
const dotenvUri = process.env.VITE_MONGODB_URI

const { MongoClient } = require('mongodb')

/* const mongoClient = new MongoClient() */

const handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World", uri: dotenvUri }),
  };
};

export { handler }
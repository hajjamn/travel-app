import { mongodbUri } from '../../src/js/variables';

const { MongoClient } = require('mongodb')

/* const mongoClient = new MongoClient() */

const handler = async function (event, context) {
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Hello World", uri: mongodbUri }),
  };
};

export { handler }
const { MongoClient } = require('mongodb');

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

const handler = async function (event, context) {
  console.log('Function execution started');

  // Log environment variables (excluding sensitive information)
  console.log('Environment Variables:', {
    MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set',
    MONGODB_DATABASE: process.env.MONGODB_DATABASE,
    MONGODB_COLLECTION: process.env.MONGODB_COLLECTION
  });

  try {
    const database = (await clientPromise).db(process.env.MONGODB_DATABASE);
    const collection = database.collection(process.env.MONGODB_COLLECTION);
    const results = await collection.find({}).limit(10).toArray();

    // Log successful database connection and query
    console.log('Successfully connected to database and retrieved results');

    return {
      statusCode: 200,
      body: JSON.stringify({
        env: {
          MONGODB_URI: process.env.MONGODB_URI ? 'Set' : 'Not Set',
          MONGODB_DATABASE: process.env.MONGODB_DATABASE,
          MONGODB_COLLECTION: process.env.MONGODB_COLLECTION
        },
        results
      }),
    };
  } catch (error) {
    // Log the error details
    console.error('Error connecting to MongoDB:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Internal Server Error',
        error: error.toString(),
        stack: error.stack
      }),
    };
  }
};

export { handler };

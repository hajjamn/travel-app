import { MongoClient, ObjectId } from 'mongodb';
import { withAuth } from './middleware';
import dotenv from 'dotenv';
dotenv.config();

const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const clientPromise = mongoClient.connect();

const fetchStop = async function (event, context) {
    console.log("Function execution started");
  
    try {
      const database = (await clientPromise).db("travel-app");
      const collection = event.queryStringParameters.collection;
      const queryId = event.queryStringParameters.id;
  
      if (!collection || !queryId) {
        throw new Error("Missing collection or id parameter");
      }
  
      const queryCollection = database.collection(collection);
      let objectId;
      try {
        objectId = new ObjectId(queryId);
      } catch (err) {
        throw new Error("Invalid ObjectId format.");
      }
  
      // Fetch the specific stop
      const stop = await queryCollection.findOne({ _id: objectId });
  
      if (!stop) {
        throw new Error("No stop record found with the provided ID.");
      }
  
      console.log("Fetched stop:", stop);
  
      return {
        statusCode: 200,
        body: JSON.stringify({
          data: stop,
        }),
      };
    } catch (error) {
      console.error("Error:", error.message);  // Log the error message
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: "Internal Server Error",
          error: error.message,
          stack: error.stack,
        }),
      };
    }
  };

  
  export const handler = withAuth(fetchStop);
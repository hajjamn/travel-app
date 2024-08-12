import { MongoClient } from "mongodb";

const mongoClient = new MongoClient(process.env.MONGODB_URI);

const clientPromise = mongoClient.connect();

const handler = async function (event, context) {
  console.log("Function execution started");

  // Log environment variables (excluding sensitive information)
  console.log("Environment Variables:", {
    MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Not Set",
    MONGODB_DATABASE: "travel-app",
  });

  try {
    const database = (await clientPromise).db("travel-app");

    // Fetch data from each collection
    const usersCollection = database.collection("users");
    const travelsCollection = database.collection("travels");
    const daysCollection = database.collection("days");
    const stopsCollection = database.collection("stops");

    const users = await usersCollection.find({}).toArray();
    const travels = await travelsCollection.find({}).toArray();
    const days = await daysCollection.find({}).toArray();
    const stops = await stopsCollection.find({}).toArray();

    // Log successful database connection and query
    console.log("Successfully connected to database and retrieved results");

    return {
      statusCode: 200,
      body: JSON.stringify({
        env: {
          MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Not Set",
          MONGODB_DATABASE: "travel-app",
        },
        data: {
          users,
          travels,
          days,
          stops,
        },
      }),
    };
  } catch (error) {
    // Log the error details
    console.error("Error connecting to MongoDB:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.toString(),
        stack: error.stack,
      }),
    };
  }
};

export { handler };

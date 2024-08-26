// fetchTravelData.js
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import { withAuth } from "./middleware"; // Import the middleware wrapper

dotenv.config();
const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri);
const clientPromise = mongoClient.connect();

// Core function logic
const fetchTravelData = async function (event, context) {
  console.log("Function execution started");

  const travelId = event.queryStringParameters
    ? event.queryStringParameters.id
    : null;

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

    let travel;
    try {
      travel = await travelsCollection.findOne({ _id: new ObjectId(travelId) });
    } catch (error) {
      return {
        statusCode: 400, // Bad Request
        body: JSON.stringify({
          message: "Invalid travel ID format.",
          error: error.toString(),
        }),
      };
    }

    console.log("Successfully connected to database and retrieved results");

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
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
        travel,
      }),
    };
  } catch (error) {
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

// Wrap the core function with authentication middleware
export const handler = withAuth(fetchTravelData);

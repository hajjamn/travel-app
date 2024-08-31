import { MongoClient, ObjectId } from "mongodb";
import { withAuth } from "./middleware";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// MongoDB connection setup
const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri);
const clientPromise = mongoClient.connect();

// Function to generate a unique ObjectId
const generateUniqueObjectId = async (database, collection) => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    uniqueId = new ObjectId();
    const existingDocument = await database
      .collection(collection)
      .findOne({ _id: uniqueId });

    if (!existingDocument) {
      isUnique = true;
    }
  }

  return uniqueId;
};

// Main handler to create a stop
const createStop = async function (event, context) {
  try {
    const database = (await clientPromise).db("travel-app");

    // Log the raw event body
    console.log("Raw event body:", event.body);

    const { travel_id, day_id, title, latitude, longitude } = JSON.parse(event.body);

    // Validate required parameters
    if (!day_id || !travel_id || !title || latitude === undefined || longitude === undefined) {
      console.log("Validation failed. Missing parameters.");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Missing required parameters" }),
      };
    }

    // Validate latitude and longitude
    if (isNaN(latitude) || isNaN(longitude)) {
      console.log("Validation failed. Latitude or longitude is not a number.");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Latitude and longitude must be numbers" }),
      };
    }

    // Convert IDs to ObjectId
    const travelId = new ObjectId(travel_id);
    const dayId = new ObjectId(day_id);

    // Generate a unique ID for the stop
    const stopId = await generateUniqueObjectId(database, "stops");
    console.log("Generated stop ID:", stopId);

    // Create a new stop object
    const newStop = {
      _id: stopId,
      travel_id: travelId,
      day_id: dayId,
      title: title,
      coordinates: {
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
      },
    };

    // Insert the new stop into the "stops" collection
    const insertedStop = await database.collection("stops").insertOne(newStop);
    console.log("Stop inserted:", insertedStop);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Stop created successfully",
        insertedStop,
      }),
    };
  } catch (error) {
    console.error("Error creating stop:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.toString(),
      }),
    };
  }
};

// Export the handler with authentication
export const handler = withAuth(createStop);

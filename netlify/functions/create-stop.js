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
  
  
      const { travel_id, day_id,  title, latitude, longitude } = JSON.parse(event.body);
      console.log("travel_id:", travel_id);
      console.log("day_id:", day_id);
  
      //Validate required parameters
      if (!day_id || !travel_id || !title || latitude === undefined || longitude === undefined) {
        console.log("Validation failed. Missing parameters.");
        return {
          statusCode: 400,
          body: JSON.stringify({ message: "Missing required parameters" }),
        };
      }
  
      // Generate a unique ID for the stop
      const stopId = await generateUniqueObjectId(database, "stops");
      console.log("Generated stop ID:", stopId);
  
      // Create a new stop object
      const newStop = {
        _id: stopId,
        travel_id: new ObjectId(travel_id),
        day_id: new ObjectId(day_id),
        title: title,
        coordinates: {
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude),
        },
      };
  
      // Insert the new stop into the "stops" collection
      const insertedStop = await database.collection("stops").insertOne(newStop);
      console.log("Stop inserted:", insertedStop);

      const getStopsForTravel = async (event) => {
        try {
          const database = (await clientPromise).db("travel-app");
      
          const stops = await database
            .collection("stops")
            .find({ travel_id: new ObjectId(travel_id) })
            .toArray();
      
          return {
            statusCode: 200,
            body: JSON.stringify({ stops }),
          };
        } catch (error) {
          return {
            statusCode: 500,
            body: JSON.stringify({
              message: "Error fetching stops",
              error: error.toString(),
            }),
          };
        }
      };
  
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
export const handler = withAuth(createStop, getStopsForTravel);
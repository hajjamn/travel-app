// Import MongoClient and ObjectId from MongoDB
import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

import { withAuth } from "./middleware";

// Get the MongoDB URI from environment variables and create a client
const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri);
const clientPromise = mongoClient.connect();

// Define the serverless function to fetch a specific day's details
const fetchDay = async function (event, context) {
    console.log("Function execution started");

    try {
        const database = (await clientPromise).db("travel-app");

        // Extract query parameters from the event
        const dayId = event.queryStringParameters.id; // This could be the day ID

        if (!dayId) {
            throw new Error("Missing or invalid id");
        }

        // Get the collection where days are stored
        const daysCollection = database.collection("days");

        // Find the specific day by id
        const day = await daysCollection.findOne({ _id: new ObjectId(dayId) });
        console.log(day);

        if (!day) {
            throw new Error("No day record found with the provided id.");
        }

        // Get the collection where stops are stored
        const stopsCollection = database.collection("stops");

        // Fetch all stops related to this day
        const stops = await stopsCollection.find({ day_id: new ObjectId(dayId) }).toArray();
        day['stops'] = stops;

        // Log successful fetch
        console.log("Successfully fetched day details:", day);

        return {
            statusCode: 200,
            body: JSON.stringify({
                data: day,
            }),
        };
    } catch (error) {
        // Log and return the error
        console.error("Error fetching day details:", error);
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

// Export the function with authentication middleware
export const handler = withAuth(fetchDay);

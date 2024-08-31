import { MongoClient, ObjectId } from "mongodb"; // Import ObjectId from mongodb
import { withAuth } from "./middleware"; // Authentication middleware
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const clientPromise = mongoClient.connect();

const deleteStop = async function (event, context) {
  try {
    // Connect to the database
    const database = (await clientPromise).db("travel-app");

    // Initialize stop_id
    let stop_id;

    // Check if request has query string parameters
    if (event.queryStringParameters) {
      stop_id = event.queryStringParameters.id; // Get the ID from the query string
    } else if (event.headers["content-type"] === "application/json") {
      const data = JSON.parse(event.body);
      stop_id = data.stop._id;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request format." }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // Convert stop_id to an ObjectId
    let objectId;
    try {
      objectId = new ObjectId(stop_id);
    } catch (e) {
      // If stop_id is not a valid ObjectId, return a 400 error
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid ID format." }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // Construct the query object for MongoDB using ObjectId
    const queryStop = { _id: objectId };

    // Get the collection
    const stopsCollection = database.collection("stops");

    // Delete the document in MongoDB
    const deletedStop = await stopsCollection.deleteOne(queryStop);

    if (deletedStop.deletedCount > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Stop deleted successfully." }),
        headers: { "Content-Type": "application/json" },
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "No stop record found with the provided ID.",
        }),
        headers: { "Content-Type": "application/json" },
      };
    }
  } catch (error) {
    console.error("Error deleting stop:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Delete failed: ${error.message}` }),
      headers: { "Content-Type": "application/json" },
    };
  }
};

// Export the handler with authentication
export const handler = withAuth(deleteStop);

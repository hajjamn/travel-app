import { MongoClient, ObjectId } from "mongodb"; // Import ObjectId from mongodb
import { withAuth } from "./middleware";
import dotenv from "dotenv";
dotenv.config();

const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const clientPromise = mongoClient.connect();

const deleteTravel = async function (event, context) {
  try {
    // Connect to the database
    const database = (await clientPromise).db("travel-app");

    // Initialize travel_id
    let travel_id;

    // Check if request has query string parameters
    if (event.queryStringParameters) {
      travel_id = event.queryStringParameters.id; // Get the ID from the query string
    } else if (event.headers["content-type"] === "application/json") {
      const data = JSON.parse(event.body);
      travel_id = data.travel._id;
    } else {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid request format." }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // Convert travel_id to an ObjectId
    let objectId;
    try {
      objectId = new ObjectId(travel_id);
    } catch (e) {
      // If travel_id is not a valid ObjectId, return a 400 error
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid ID format." }),
        headers: { "Content-Type": "application/json" },
      };
    }

    // Construct the query object for MongoDB using ObjectId
    const queryTravel = { _id: objectId };

    // Get the collection
    const travelsCollection = database.collection("travels");

    // Delete the document in MongoDB
    const deletedTravel = await travelsCollection.deleteOne(queryTravel);

    if (deletedTravel.deletedCount > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({ message: "Travel deleted successfully." }),
        headers: { "Content-Type": "application/json" },
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "No travel record found with the provided ID.",
        }),
        headers: { "Content-Type": "application/json" },
      };
    }
  } catch (error) {
    console.error("Error deleting travel:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Delete failed: ${error.message}` }),
      headers: { "Content-Type": "application/json" },
    };
  }
};

export const handler = withAuth(deleteTravel);

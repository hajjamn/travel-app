// Import MongoClient to use the drivers to "speak the same language" as MongoDB
import { MongoClient, ObjectId } from "mongodb"; // Use ObjectId instead of BSON directly
import { withAuth } from "./middleware";

// Import dotenv to use the variables in the .env file in the development environment
import dotenv from "dotenv";
dotenv.config();

// Retrieve the super-secret MongoDB URI and use it to establish the connection
const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Connect to the server
const clientPromise = mongoClient.connect();

const updateTravel = async function (event, context) {
  try {
    // Connect to the database
    const database = (await clientPromise).db("travel-app");

    // Check the content type of the request and parse accordingly
    let travel_id, destination, start_date, end_date;

    if (event.headers["content-type"] === "application/x-www-form-urlencoded") {
      // Parse form data
      const formData = new URLSearchParams(event.body);

      travel_id = formData.get("travel[_id]");
      destination = formData.get("travel[destination]");
      start_date = formData.get("travel[start_date]");
      end_date = formData.get("travel[end_date]");
    } else if (event.headers["content-type"] === "application/json") {
      // Parse JSON body
      const data = JSON.parse(event.body);

      travel_id = data.travel._id;
      destination = data.travel.destination;
      start_date = data.travel.start_date;
      end_date = data.travel.end_date;
    } else {
      // Unsupported content type
      return {
        statusCode: 400,
        body: `<h1>Unsupported Content Type</h1><p>Please use application/x-www-form-urlencoded or application/json.</p>`,
        headers: {
          "Content-Type": "text/html",
        },
      };
    }

    // removed validation of objectId and pass it like a normal string
    const queryTravel = { _id: new ObjectId(travel_id) }; // Use travel_id as a string directly

    // Define the MongoDB update queries
    const updateTravel = {
      $set: {
        destination: destination,
        start_date: start_date,
        end_date: end_date,
      },
    };

    // Get the collection
    const travelsCollection = database.collection("travels");

    // Update the document in MongoDB
    const updatedTravel = await travelsCollection.updateOne(
      queryTravel,
      updateTravel
    );

    if (updatedTravel.modifiedCount > 0) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          message: "Travel details updated successfully.",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({
          message: "No travel record found with the provided ID.",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      };
    }
  } catch (error) {
    console.error("Error updating travel:", error); // Log the error
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Update failed: ${error.message}` }), // Return more specific error details
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};

// Export the handler for Netlify
export const handler = withAuth(updateTravel);

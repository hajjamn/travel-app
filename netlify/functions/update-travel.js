// Import MongoClient to use the drivers to "speak the same language" as MongoDB
import { MongoClient, ObjectId } from "mongodb"; // Use ObjectId instead of BSON directly

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

const handler = async (event, context) => {
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

    // Ensure travel_id is a valid MongoDB ObjectId
    if (!ObjectId.isValid(travel_id)) {
      return {
        statusCode: 400,
        body: `<h1>Invalid Travel ID</h1><p>The provided travel ID is not valid.</p>`,
        headers: {
          "Content-Type": "text/html",
        },
      };
    }

    // Define the MongoDB update queries
    const queryTravel = { _id: new ObjectId(travel_id) }; // Convert to ObjectId
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
        body: `<h1>Update Successful</h1><p>Travel details updated successfully.</p>`,
        headers: {
          "Content-Type": "text/html",
        },
      };
    } else {
      return {
        statusCode: 404,
        body: `<h1>Update Failed</h1><p>No travel record found with the provided ID.</p>`,
        headers: {
          "Content-Type": "text/html",
        },
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: `<h1>Update Failed</h1><p>${error.toString()}</p>`,
      headers: {
        "Content-Type": "text/html",
      },
    };
  }
};

// Export the handler for Netlify
export { handler };

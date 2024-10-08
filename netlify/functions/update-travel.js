import { MongoClient, ObjectId } from "mongodb";
import { withAuth } from "./middleware";
import dotenv from "dotenv";
dotenv.config();

const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const clientPromise = mongoClient.connect();

const updateTravel = async function (event, context) {
  try {
    const database = (await clientPromise).db("travel-app");

    let travel_id, destination, start_date, end_date, budget;

    if (event.headers["content-type"] === "application/x-www-form-urlencoded") {
      const formData = new URLSearchParams(event.body);

      travel_id = formData.get("travel[_id]");
      destination = formData.get("travel[destination]");
      start_date = formData.get("travel[start_date]");
      end_date = formData.get("travel[end_date]");
      budget = parseFloat(formData.get("travel[budget]")) || 0;
    } else if (event.headers["content-type"] === "application/json") {
      const data = JSON.parse(event.body);

      travel_id = data.travel._id;
      destination = data.travel.destination;
      start_date = data.travel.start_date;
      end_date = data.travel.end_date;
      budget = parseFloat(data.travel.budget) || 0;
    } else {
      return {
        statusCode: 400,
        body: `<h1>Unsupported Content Type</h1><p>Please use application/x-www-form-urlencoded or application/json.</p>`,
        headers: {
          "Content-Type": "text/html",
        },
      };
    }

    const queryTravel = { _id: new ObjectId(travel_id) };

    const updateTravel = {
      $set: {
        destination: destination,
        start_date: start_date,
        end_date: end_date,
        budget: budget, // Include budget in the update
      },
    };

    const travelsCollection = database.collection("travels");

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
    console.error("Error updating travel:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: `Update failed: ${error.message}` }),
      headers: {
        "Content-Type": "application/json",
      },
    };
  }
};

export const handler = withAuth(updateTravel);

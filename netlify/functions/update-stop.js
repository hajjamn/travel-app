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

const updateStop = async function (event, context) {
    try {
        const database = (await clientPromise).db("travel-app");

        let stop_id, title, coordinates;

        if (event.headers["content-type"] === "application/x-www-form-urlencoded") {
            // Parse form data
            const formData = new URLSearchParams(event.body);
      
            stop_id = formData.get("stop[_id]");
            title = formData.get("stop[title]");
            coordinates = formData.get("stop[coordinates]");
            // Parse coordinates string to array of numbers if needed (e.g., "34.05,-118.25" -> [34.05, -118.25])
            if (coordinates) {
                coordinates = coordinates.split(',').map(coord => parseFloat(coord.trim()));
            }
          } else if (event.headers["content-type"] === "application/json") {
            // Parse JSON body
            const data = JSON.parse(event.body);
      
            stop_id = data.stop._id;
            title = data.stop.title;
            coordinates = data.stop.coordinates;
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

          // Validate that stop_id is a valid ObjectId
        if (!ObjectId.isValid(stop_id)) {
            return {
                statusCode: 400,
                body: JSON.stringify({
                    message: "Invalid stop ID format.",
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            };
        }

          const queryStop = { _id: new ObjectId(stop_id)};

          const updateStop = {
            $set: {
                title: title,
                coordinates: coordinates,
            },
          };

          const stopsCollection = database.collection("stops");

          const updatedStop = await stopsCollection.updateOne(
            queryStop,
            updateStop
          );

          if (updatedStop.modifiedCount > 0) {
            return {
              statusCode: 200,
              body: JSON.stringify({
                message: "Stop details updated successfully.",
              }),
              headers: {
                "Content-Type": "application/json",
              },
            };
          } else {
            return {
              statusCode: 404,
              body: JSON.stringify({
                message: "No stop record found with the provided ID.",
              }),
              headers: {
                "Content-Type": "application/json",
              },
            };
          }
    } catch (error) {
        console.error("Error updating stop:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: `Update failed: ${error.message}` }), // Return more specific error details
            headers: {
              "Content-Type": "application/json",
            },
          };
    }
};

export const handler = withAuth(updateStop);
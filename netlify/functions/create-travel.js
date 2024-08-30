import { MongoClient, ObjectId } from "mongodb";
import { withAuth } from "./middleware";
import jwt from "jsonwebtoken"; // Import jwt using ES6 import
import dotenv from "dotenv";

dotenv.config();

const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri);
const clientPromise = mongoClient.connect();
const jwtSecret = process.env.MY_SECRET;

const generateUniqueObjectId = async (database, collection) => {
  let uniqueId;
  let isUnique = false;

  while (!isUnique) {
    uniqueId = new ObjectId();
    const existingTravel = await database
      .collection(collection)
      .findOne({ _id: uniqueId });

    if (!existingTravel) {
      isUnique = true;
    }
  }

  return uniqueId;
};

const createTravel = async function (event, context) {
  console.log("Function execution started");
  try {
    const database = (await clientPromise).db("travel-app");

    const destination = event.queryStringParameters.destination;
    const start_date = event.queryStringParameters.start_date;
    const end_date = event.queryStringParameters.end_date;

    //Extract the JWT token from cookies
    const cookieHeader = event.headers.cookie;
    if (!cookieHeader) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No cookies found in request" }),
      };
    }

    const token = getTokenFromCookies(cookieHeader, "token");
    if (!token) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Authentication token not found" }),
      };
    }

    //Verify JWT token and extract user email
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret); // Make sure jwtSecret is defined in .env
    } catch (err) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid token" }),
      };
    }

    const userEmail = decoded.email; // Extract email from the decoded JWT token

    //Find the user in MongoDB by email
    const user = await database
      .collection("users")
      .findOne({ email: userEmail });
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found", user }),
      };
    }

    // Generate a unique ID for the travel
    const travelId = await generateUniqueObjectId(database, "travels");

    const newTravel = {
      _id: travelId,
      user_id: user._id,
      destination: destination,
      start_date: start_date,
      end_date: end_date,
    };

    const insertedTravel = await database
      .collection("travels")
      .insertOne(newTravel);
    console.log("Travel inserted: ", insertedTravel);

    const startDate = new Date(newTravel.start_date);
    const endDate = new Date(newTravel.end_date);

    const days = [];

    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayId = await generateUniqueObjectId(database, "days");

      const newDay = {
        _id: dayId,
        travel_id: travelId,
        date: new Date(d),
      };

      days.push(newDay);
    }

    const insertedDays = await database.collection("days").insertMany(days);
    console.log("Days inserted: ", insertedDays);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {
          insertedTravel,
          insertedDays,
        },
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

function getTokenFromCookies(cookieHeader, tokenName) {
  const cookies = cookieHeader.split("; ");
  for (let cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === tokenName) {
      return value;
    }
  }
  return null;
}

export const handler = withAuth(createTravel);

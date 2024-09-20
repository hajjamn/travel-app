import { connectToDatabase } from "./utils/DBconnection";  // No need to pass URI anymore
import { generateUniqueObjectId } from "./utils/generateObjectID";
import { withAuth } from "./middleware";
import jwt from "jsonwebtoken"; // Import jwt using ES6 import
import dotenv from "dotenv";

dotenv.config();

const jwtSecret = process.env.MY_SECRET;

const createTravel = async function (event, context) {
  console.log("Function execution started");
  try {
    const database = await connectToDatabase(); // No need to pass MONGODB_URI

    const { destination, start_date, end_date } = event.queryStringParameters;
    const budget = parseFloat(event.queryStringParameters.budget) || 0;

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

    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
    } catch (err) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid token" }),
      };
    }

    const userEmail = decoded.email;
    const user = await database.collection("users").findOne({ email: userEmail });

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found", user }),
      };
    }

    const travelId = await generateUniqueObjectId(database, "travels");

    const newTravel = {
      _id: travelId,
      user_id: user._id,
      destination,
      start_date,
      end_date,
      budget, // Include budget in the travel document
    };

    const insertedTravel = await database.collection("travels").insertOne(newTravel);
    console.log("Travel inserted: ", insertedTravel);

    const startDate = new Date(newTravel.start_date);
    const endDate = new Date(newTravel.end_date);

    const days = [];
    let index = 0;

    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
      const dayId = await generateUniqueObjectId(database, "days");
      index++;
      const newDay = {
        _id: dayId,
        travel_id: travelId,
        date: new Date(d),
        day_number: index,
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

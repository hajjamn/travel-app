import { connectToDatabase } from "./utils/DBconnection";
import { generateUniqueObjectId } from "./utils/generateObjectID";
import { withAuth } from "./middleware";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const DEBUG = true;

function logDebug(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

const jwtSecret = process.env.MY_SECRET;

const createTravel = async function (event, context) {
  logDebug("Function execution started");

  try {
    logDebug("Parsing query parameters from URL");
    const { destination, start_date, end_date } = event.queryStringParameters;
    const budget = parseFloat(event.queryStringParameters.budget) || 0;
    logDebug(`Parsed parameters: destination=${destination}, start_date=${start_date}, end_date=${end_date}, budget=${budget}`);

    logDebug("Connecting to MongoDB...");
    const database = await connectToDatabase();
    logDebug("Successfully connected to MongoDB");

    logDebug("Retrieving cookies from request headers");
    const cookieHeader = event.headers.cookie;
    if (!cookieHeader) {
      console.error("No cookies found in the request");
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "No cookies found in request" }),
      };
    }
    logDebug("Cookies found");

    logDebug("Extracting token from cookies");
    const token = getTokenFromCookies(cookieHeader, "token");
    if (!token) {
      console.error("Authentication token not found in cookies");
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Authentication token not found" }),
      };
    }
    logDebug("Token found");

    logDebug("Verifying token...");
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret);
      logDebug("Token verified successfully");
    } catch (err) {
      console.error("Token verification failed:", err);
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid token" }),
      };
    }

    logDebug(`Looking up user by email: ${decoded.email}`);
    const userEmail = decoded.email;
    const user = await database.collection("users").findOne({ email: userEmail });

    if (!user) {
      console.error(`User with email ${userEmail} not found`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found", user }),
      };
    }
    logDebug("User found:", user);

    logDebug("Generating unique travel ID");
    const travelId = await generateUniqueObjectId(database, "travels");

    logDebug("Creating new travel document");
    const newTravel = {
      _id: travelId,
      user_id: user._id,
      destination,
      start_date,
      end_date,
      budget,
    };

    logDebug("Inserting travel document into the database");
    const insertedTravel = await database.collection("travels").insertOne(newTravel);
    logDebug("Travel inserted successfully:", insertedTravel);

    logDebug("Creating day entries between start_date and end_date");
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
      logDebug(`Day ${index}:`, newDay);
      days.push(newDay);
    }

    logDebug("Inserting day entries into the database");
    const insertedDays = await database.collection("days").insertMany(days);
    logDebug("Days inserted successfully:", insertedDays);

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
    console.error("Error connecting to MongoDB or executing function:", error);
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

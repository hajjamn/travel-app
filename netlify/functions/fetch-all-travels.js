import { connectToDatabase } from "./utils/DBconnection";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { withAuth } from "./middleware";

dotenv.config();

const DEBUG = true;

function logDebug(...args) {
  if (DEBUG) {
    console.log(...args);
  }
}

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

const jwtSecret = process.env.MY_SECRET;

const fetchTravelData = async function (event, context) {
  logDebug("Function execution started");

  try {
    logDebug("Connecting to MongoDB...");
    const database = await connectToDatabase();
    logDebug("Successfully connected to MongoDB");

    logDebug("Extracting JWT token from cookies...");
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
    logDebug("Token found and extracted successfully.");

    let decoded;
    try {
      logDebug("Verifying token...");
      decoded = jwt.verify(token, jwtSecret);
      logDebug("Token verified successfully");
    } catch (err) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid token" }),
      };
    }

    const userEmail = decoded.email;
    logDebug(`User email extracted from token: ${userEmail}`);

    const usersCollection = database.collection("users");
    const user = await usersCollection.findOne({ email: userEmail });

    if (!user) {
      logDebug(`User with email ${userEmail} not found.`);
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    const userId = user._id;
    logDebug(`User found with ID: ${userId}`);

    const travelsCollection = database.collection("travels");

    logDebug("Fetching travel documents for the user...");
    const travels = await travelsCollection
      .find({ user_id: userId })
      .toArray();

    logDebug(`Travels fetched successfully. Total travels: ${travels.length}`);

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        env: {
          MONGODB_URI: process.env.MONGODB_URI ? "Set" : "Not Set",
          MONGODB_DATABASE: "travel-app",
        },
        data: {
          travels,
        },
      }),
    };
  } catch (error) {
    logDebug("Error occurred during MongoDB connection or data fetching:", error);
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

export const handler = withAuth(fetchTravelData);

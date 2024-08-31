import { MongoClient, ObjectId } from "mongodb";
import dotenv from "dotenv";
import jwt from "jsonwebtoken"; // Import JWT for decoding the token
import { withAuth } from "./middleware";

dotenv.config();

const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri);
const clientPromise = mongoClient.connect();
const jwtSecret = process.env.MY_SECRET; // Ensure JWT_SECRET is defined in .env file

// Function to fetch travel data for authenticated user
const fetchTravelData = async function (event, context) {
  try {
    const database = (await clientPromise).db("travel-app");

    // Step 1: Extract JWT token from cookies
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

    // Step 2: Verify JWT token and extract user email
    let decoded;
    try {
      decoded = jwt.verify(token, jwtSecret); // Decode and verify JWT token
    } catch (err) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid token" }),
      };
    }

    const userEmail = decoded.email; // Extract email from decoded token

    // Step 3: Find user in MongoDB by email to get user ID
    const usersCollection = database.collection("users");
    const user = await usersCollection.findOne({ email: userEmail });

    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "User not found" }),
      };
    }

    // User ID found, proceed to fetch user-specific travel data
    const userId = user._id;

    // Step 4: Fetch travels where user_id matches the found user ID
    const travelsCollection = database.collection("travels");
    const daysCollection = database.collection("days");
    const stopsCollection = database.collection("stops");

    const travels = await travelsCollection.find({ user_id: userId }).toArray(); // Fetch travels for this user
    const travelIds = travels.map((travel) => travel._id);

    // Fetch days and stops linked to the user's travels
    const days = await daysCollection
      .find({ travel_id: { $in: travelIds } })
      .toArray();
    const stops = await stopsCollection
      .find({ travel_id: { $in: travelIds } })
      .toArray();

    // Return response with travel data
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
          days,
          stops,
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

// Helper function to extract token from cookies
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

// Export the handler with authentication middleware
export const handler = withAuth(fetchTravelData);

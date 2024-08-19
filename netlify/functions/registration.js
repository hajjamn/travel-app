import bcrypt from "bcrypt";
import { MongoClient } from "mongodb";
import dotenv from "dotenv";

dotenv.config();

const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri);

const clientPromise = mongoClient.connect();

const handler = async function (event, context) {
  console.log("Function execution started");

  try {
    // Connect to the database
    const database = (await clientPromise).db("travel-app");

    // Extract user data from query parameters
    const userData = {
      email: event.queryStringParameters["dataUser[email]"],
      username: event.queryStringParameters["dataUser[username]"],
      password: event.queryStringParameters["dataUser[password]"],
    };

    // Hash the password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Create user object
    const user = {
      email: userData.email,
      name: userData.username,
      hashed_password: hashedPassword,
    };

    // Insert user into the "users" collection
    const usersCollection = database.collection("users");
    const userInsert = await usersCollection.insertOne(user);

    // Return a success response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "User successfully created",
        userId: userInsert.insertedId,
      }),
    };
  } catch (error) {
    console.error("Error processing request:", error);

    // Return an error response
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
    };
  }
};

export { handler };

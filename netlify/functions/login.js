import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();

const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri);
const clientPromise = mongoClient.connect();

const handler = async function (event, context) {
  try {
    // Extract email and password from query parameters
    const email = event.queryStringParameters["dataUser[email]"];
    const password = event.queryStringParameters["dataUser[password]"];

    if (!email || !password) {
      return {
        statusCode: 400,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Email and password are required" }),
      };
    }

    const database = (await clientPromise).db("travel-app");
    const usersCollection = database.collection("users");

    // Find the user by email
    const user = await usersCollection.findOne({ email });

    // Check if user exists and has a password field
    if (!user) {
      return {
        statusCode: 401,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Invalid email or password" }),
      };
    }

    // Check if password field exists in user document
    if (!user.hashed_password) {
      return {
        statusCode: 401,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "User password not found" }),
      };
    }

    // Compare the provided password with the hashed password stored in the database
    const passwordMatch = await bcrypt.compare(password, user.hashed_password);

    if (!passwordMatch) {
      return {
        statusCode: 401,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: "Invalid password" }),
      };
    }

    // Remove sensitive data before creating the token
    delete user.hashed_password;

    // Create a token
    const token = jwt.sign(
      { email: user.email, name: user.username },
      process.env.MY_SECRET,
      {
        expiresIn: "24h",
      }
    );

    // Successful login response
    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        // Set-Cookie header for JWT (in a real application, this should be done with proper security settings)
        // "Set-Cookie": `token=${token}; HttpOnly; Max-Age=3600; Path=/`,
      },
      multiValueHeaders: {
        "Set-Cookie": [`token=${token}; HttpOnly; Max-Age=3600; Path=/`],
      },
      body: JSON.stringify({
        message: "Login successful",
        user: {
          email: user.email,
          name: user.name,
          // Include other non-sensitive user details if needed
        },
      }),
    };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      statusCode: 500,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.toString(),
      }),
    };
  }
};

export { handler };

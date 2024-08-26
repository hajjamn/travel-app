// authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// Middleware function to verify JWT and handle serverless function execution
export const withAuth = (handler) => async (event, context) => {
  // Extract cookies from the headers
  const cookies = event.headers.cookie || "";

  // Parse the cookies to get the token
  const token = cookies
    .split("; ")
    .find((cookie) => cookie.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return {
      statusCode: 401,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: "Unauthorized: Token is missing" }),
    };
  }

  try {
    // Verify the JWT token using the secret from environment variables
    const decoded = jwt.verify(token, process.env.MY_SECRET);

    // Token is valid, add user data to the event and call the handler
    event.user = decoded; // Optionally add user data to event object
    return await handler(event, context);
  } catch (error) {
    let errorMessage = "Invalid token";

    if (error.name === "TokenExpiredError") {
      errorMessage = "Token has expired";
    } else if (error.name === "JsonWebTokenError") {
      errorMessage = "Invalid token";
    }

    return {
      statusCode: 401,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: errorMessage }),
    };
  }
};

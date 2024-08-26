import { withAuth } from "./middleware";

const fetchToken = async (event, context) => {
  const user = event.user; // This user object is added by the middleware after JWT verification

  // Your function logic goes here
  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "Function executed successfully", user }),
  };
};

export const handler = withAuth(fetchToken);

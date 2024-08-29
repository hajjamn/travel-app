// netlify/functions/logout.js

exports.handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      "Set-Cookie":
        "token=; HttpOnly; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=localhost",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: "Logged out successfully" }),
  };
};

import bcrypt from "bcrypt";

//Importiamo MongoClient che ci permette di usare i driver per "parlare la stessa lingua" di MongoDB
import { MongoClient } from "mongodb";

//Importiamo dotenv per usare le variabili nel file .env in ambiente di sviluppo
import dotenv from "dotenv";
dotenv.config();

//Recuperiamo l'Uri supersegreto di MongoDB e la usiamo per fare la connessione
const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri);

//Connessione al server
const clientPromise = mongoClient.connect();

function register(email, username, password) {
  const handler = async function (event, context) {
    console.log("Function execution started");
    try {
      const database = (await clientPromise).db("travel-app");

      const user = {
        email: email,
        name: username,
        password: bcrypt.hash(password),
      };

      const usersCollection = database.collection("users");

      const userInsert = await usersCollection.insertOne(user);

      return {
        statusCode: 200,
        body: JSON.stringify({
          data: {
            usersCollection,
            userInsert,
          },
        }),
      };
    } catch (error) {
      // Log the error details
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
}

export { register };

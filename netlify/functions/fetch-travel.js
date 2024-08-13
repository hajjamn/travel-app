//Importiamo MongoClient che ci permette di usare i driver per "parlare la stessa lingua" di MongoDB
import { MongoClient } from "mongodb";
//Importiamo dotenv per usare le variabili nel file .env in ambiente di sviluppo
import dotenv from "dotenv";
dotenv.config();

//Recuperiamo l'Uri supersegreto di MongoDB e la usiamo per fare la connessione
const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri);

//Sinceramente non ho capito bene cosa fa qui
const clientPromise = mongoClient.connect();

const handler = async function (event, context) {
  console.log("Function execution started");

  try {
    const database = (await clientPromise).db("travel-app");

    //Estraiamo i parametri dall'evento. In netlify si fa cosi


    const collection = event.queryStringParameters.collection;
    const query = event.queryStringParameters.query;
    /* const query = 'travel1'
    const collection = 'travels' */

    //Ci colleghiamo a quella collection
    const queryCollection = database.collection(collection);

    const travel = await queryCollection.find({ _id: query }).toArray();

    const daysCollection = database.collection("days");
    const days = await daysCollection.find({ 'travel_id': query }).toArray();

    // Log successful database connection and query
    console.log("Successfully connected to database and retrieved results");

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {
          travel,
          days
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

export { handler };

//Importiamo MongoClient che ci permette di usare i driver per "parlare la stessa lingua" di MongoDB
import { MongoClient, ObjectId } from "mongodb";
//Importiamo dotenv per usare le variabili nel file .env in ambiente di sviluppo
import dotenv from "dotenv";
dotenv.config();

import { withAuth } from "./middleware";

//Recuperiamo l'Uri supersegreto di MongoDB e la usiamo per fare la connessione
const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri);

//Connessione al server
const clientPromise = mongoClient.connect();

const fetchTravel = async function (event, context) {
  console.log("Function execution started");

  try {
    const database = (await clientPromise).db("travel-app");

    //Estraiamo i parametri dall'evento. In netlify si fa cosi
    const queryId = event.queryStringParameters.id;

    if (!queryId) {
      throw new Error("Missing collection or id parameter");
    }

    //Ci colleghiamo a quella collection
    const queryCollection = database.collection('travels');

    // Check if queryId is a valid ObjectId
    let objectId;
    try {
      objectId = new ObjectId(queryId);
    } catch (err) {
      throw new Error("Invalid ObjectId format.");
    }

    console.log("Querying for travel ID:", queryId);

    // Fetch the document with the provided ID
    const travel = await queryCollection.findOne({ _id: objectId });
    console.log("Fetched travel document:", travel);



    if (!travel) {
      throw new Error("No travel record found with the provided ID.");
    }

    //Adesso recuperiamo anche tutti i giorni dalla collection days che hanno a travel_id l'id della query
    const daysCollection = database.collection("days");
    const days = await daysCollection.find({ "travel_id": new ObjectId(queryId) }).toArray();

    //Adesso recuperiamo tutti gli stop per ogni giorno dell'array che abbiamo salvato
    const stopsCollection = database.collection("stops");
    for (let i = 0; i < days.length; i++) {
      const day = days[i];
      const stops = await stopsCollection.find({ 'day_id': new ObjectId(day._id) }).toArray();
      day['stops'] = stops;
      console.log(day)
    }


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

export const handler = withAuth(fetchTravel);

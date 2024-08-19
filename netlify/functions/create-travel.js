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

const handler = async function (event, context) {
  console.log("Function execution started");
  try {
    const database = (await clientPromise).db("travel-app");

    //recuperare i parametri dal form

    const queryTravel = {
      user_id: "user3",
      destination: "Padova",
      start_date: "2024-08-15",
      end_date: "2024-08-18",
    };
    const queryDays = {
      travel_id: "travel1234",
      date: "2024-12-15",
    };
    const queryStops = {
      day_id: "day1234",
      title: "CasaMiaXd",
      coordinates: {
        latitude: 41.8902,
        longitude: 12.4922,
      },
    };
    // const queryUser = event.queryStringParameters.user;
    // const queryTravel = event.queryStringParameters.travel;
    // const queryDays = event.queryStringParameters.days;
    // const queryStops = event.queryStringParameters.stops;

    const travelsCollection = database.collection("travels");
    const daysCollection = database.collection("days");
    const stopsCollection = database.collection("stops");

    const travels = await travelsCollection.insertOne(queryTravel);
    const days = await daysCollection.insertOne(queryDays);
    const stops = await stopsCollection.insertOne(queryStops);

    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {
          travelsCollection,
          daysCollection,
          stopsCollection,
        },
      }),
    };

    //inserire i parametri dentro al database
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

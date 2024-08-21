//Importiamo MongoClient che ci permette di usare i driver per "parlare la stessa lingua" di MongoDB
import { MongoClient, BSON } from "mongodb";

//Importiamo dotenv per usare le variabili nel file .env in ambiente di sviluppo
import dotenv from "dotenv";
dotenv.config();

//Recuperiamo l'Uri supersegreto di MongoDB e la usiamo per fare la connessione
const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri);

//Connessione al server
const clientPromise = mongoClient.connect();

const handler = async (event, context) => {
    console.log("Handling la request...");

    try {
        //connect al database
        const database = (await clientPromise).db("travel-app");

         // Parse form data
         const formData = new URLSearchParams(event.body);

         const travel_id = formData.get("travel_id");
         const destination = formData.get("destination");
         const start_date = formData.get("start_date");
         const end_date = formData.get("end_date");

        //define the mongoDB update queries
        const queryTravel = {_id: new BSON.ObjectId(travel_id)};
        const updateTravel = {
            $set: {
                destination: destination,
                start_date: start_date,
                end_date: end_date,
            },
        };

        //get collection
        const travelsCollection = database.collection("travels");

        //update document in MongoDB
        const updatedTravel = await travelsCollection.updateOne(queryTravel, updatedTravel);

        return {
            statusCode: 200,
            body: `<h1>Update Successful</h1><p>Travel details updated successfully. </p> `,
            headers: {
                "Content-Type" : "text/html"
            },
        };
    } catch (error) {
        console.error("Error updating data:", error);

        return {
            statusCode: 500,
            body: `<h1>Update Failed</h1><p>${error.toString()}</p>`,
            headers: {
                "Content-Type": "text/html",
            },
        };
    }
};

// Export the handler for Netlify
export { handler };

//da connettere poi con il form per update ----> <form action="/.netlify/functions/update" method= "POST">
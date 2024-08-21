//Importiamo MongoClient che ci permette di usare i driver per "parlare la stessa lingua" di MongoDB. ObjectId ci fa creare gli id
import { MongoClient, ObjectId } from "mongodb";

//Importiamo dotenv per usare le variabili nel file .env in ambiente di sviluppo
import dotenv from "dotenv";
dotenv.config();

//Recuperiamo l'Uri supersegreto di MongoDB e la usiamo per fare la connessione
const mongodbUri = process.env.MONGODB_URI;
const mongoClient = new MongoClient(mongodbUri);

//Connessione al server
const clientPromise = mongoClient.connect();

//Funzione per generare il l'id da assegnare al travel e poterlo poi assegnare al travel_id dei vari giorni
const generateUniqueObjectId = async (database, collection) => {

  let uniqueId;
  let isUnique = false;

  //Finche' il valore isUnique e' false
  while (!isUnique) {
    uniqueId = new ObjectId();//genera un nuovo oggetto

    // Controlliamo se uniqueId esiste gia' nella collection travels
    const existingTravel = await database.collection(collection).findOne({ _id: uniqueId });

    if (!existingTravel) {
      isUnique = true; // Se non trova nulla, isUnique diventa true e il ciclo termina
    }
  }

  //ritorniamo lo uniqueId
  return uniqueId;
};


const handler = async function (event, context) {
  console.log("Function execution started");
  try {
    const database = (await clientPromise).db("travel-app");

    //Generiamo un id unico con la funzione creata sopra
    const travelId = await generateUniqueObjectId(database, 'travels');

    //Usiamo dati statici e l'ID generato per creare un travel
    const newTravel = {
      _id: travelId,
      user_id: "user3",
      destination: "Milano",
      start_date: "2024-08-13",
      end_date: "2024-08-16",
    };

    //Inseriamo il viaggio nella collection
    const insertedTravel = await database.collection("travels").insertOne(newTravel);
    console.log("Travel inserted: ", insertedTravel)

    // Parsiamo start_date ed end_date cosi' invece di stringhe sono date
    const startDate = new Date(newTravel.start_date);
    const endDate = new Date(newTravel.end_date);

    // Creiamo un bell'array per contenere i giorni che andremo a creare
    const days = [];

    // Cicliamo ogni data da start date a End date. Sembra brutto ma e' leggibile
    for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {

      //creiamo un ID per il giorno
      const dayId = await generateUniqueObjectId(database, 'days');

      // Creiamo un oggetto per questa data
      const newDay = {
        _id: dayId,
        travel_id: travelId, // Usiamo l'ID generato prima
        date: d, // Convertiamo al formato di data YYYY-MM-DD
      };

      // Pushiamo l-oggetto nell'array
      days.push(newDay);
    }

    // Inseriamo tutti gli oggetti nell'array nella collection
    const insertedDays = await database.collection("days").insertMany(days);
    console.log("Days inserted: ", insertedDays)


    return {
      statusCode: 200,
      body: JSON.stringify({
        data: {
          insertedTravel,
          insertedDays
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

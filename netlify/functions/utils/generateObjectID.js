import { ObjectId } from 'mongodb';

export async function generateUniqueObjectId(database, collection) {
    let uniqueId;
    let isUnique = false;

    while (!isUnique) {
        uniqueId = new ObjectId();
        const existingDocument = await database.collection(collection).findOne({ _id: uniqueId });
        if (!existingDocument) {
            isUnique = true;
        }
    }

    return uniqueId;
}

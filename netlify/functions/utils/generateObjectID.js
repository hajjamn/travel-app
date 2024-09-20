const { ObjectId } = require('mongodb');

async function generateUniqueObjectId(database, collection) {
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

module.exports = { generateUniqueObjectId };

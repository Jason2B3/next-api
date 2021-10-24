import { MongoClient } from "mongodb";

export async function databaseConnect() {
  const password = "TM01Focus";
  const databaseName = "sample_mflix";
  // JasonB was the database user I created
  const url = `mongodb+srv://JasonB:${password}@first-cluster.g9k83.mongodb.net/${databaseName}?retryWrites=true&w=majority`;
  const client = await MongoClient.connect(url);
  return client;
}

// Create
export async function createDocument(client, collection, document) {
  const db = client.db();
  const result = await db.collection(collection).insertOne(document);
  return result;
}

// Read
export async function readDocuments() {
  const db = client.db();
  const documents = await db.collection(collection).find().sort().toArray();
  return documents;
}

//% Update (unsure)
export async function updateDocument(client, collection, document) {}

//% Delete (unsure)
export async function deleteDocument(client, collection, document) {}

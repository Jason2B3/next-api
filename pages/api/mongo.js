import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  // These credentials must only be used in server-side code
  const mongoURI = `mongodb+srv://JasonB:TM01Focus@first-cluster.g9k83.mongodb.net/sample_mflix?retryWrites=true&w=majority`;
  // if the database we put does not exist, it will be created on the fly
  if (req.method === "GET") {
    const client = await MongoClient.connect(mongoURI);
    const db = client.db(); // get ahold of that database
    const collection = db.collection("movies");
    const results = await collection.find().sort().toArray();
    // console.log(results);
    client.close(); // close the database instance
    res.status(201).json({ message: "read complete", results });
  }
}

import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const cluster = {
    username: "JasonB",
    mongoPassword: "TM01Focus",
    database: "email-list",
    collection: "demo2",
  };
  const mongoURI = `mongodb+srv://JasonB:${cluster.mongoPassword}@first-cluster.g9k83.mongodb.net/${cluster.database}?retryWrites=true&w=majority`;

  // READ: Place all collection docs in an array
  // Then pass return that array through the response object as JSON
  if (req.method === "GET") {
    const client = await MongoClient.connect(mongoURI);
    const db = client.db(); // get ahold of that database
    const collection = db.collection(cluster.collection);
    const results = await collection.find().sort().toArray(); 
    // can add .limit() before .toArray()
    client.close(); // close the database instance
    res.status(200).json({ message: "read complete", results: results });
  }

  if (req.method === "POST") {
    const feedbackObj={
      email: req.body.email,
      comment: req.body.comment,
    } //organize the data you made the request with
    const client = await MongoClient.connect(mongoURI);
    const db = client.db(); // get ahold of that database
    await db.collection(cluster.collection).insertOne(feedbackObj)
    res.status(200).json({ message: "POST complete" });
  }
}

// All data inside the API route is private (good b/c we have credentials here)

// export asy
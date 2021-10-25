import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const cluster = {
    username: "JasonAdmin",
    mongoPassword: "2BReborn",
    database: "email-list",
    collection: "demo2",
  };
  const mongoURI= `mongodb+srv://JasonAdmin:${cluster.mongoPassword}@cluster0.ufiop.mongodb.net/${cluster.database}?retryWrites=true&w=majority`
  
  if (req.method === "POST") {
    // Organize the data you made the request with
    const feedbackObj = {
      email: req.body.email,
      comment: req.body.comment,
    };
    const client = await MongoClient.connect(mongoURI);
    const db = client.db(); // get ahold of that database

    // See if this email has been used in the database already
    const check = await db
      .collection(cluster.collection)
      .findOne({ email: req.body.email });

    // Check if a doc with that email exists yet (check=null if it doesn't)
    // Create a new doc in this case
    console.log(check);
    if (!check) {
      await db.collection(cluster.collection).insertOne(feedbackObj);
      client.close();
      res.status(200).json({ message: "POST complete" });
      return;
    }

    // If a doc with that email does exist, update it instead of creating a new doc
    if (check) {
      await db
        .collection(cluster.collection)
        .updateOne({ _id: check._id }, { $set: feedbackObj });
      client.close();
      res.status(200).json({ message: "UPDATE complete" });
      return;
    }
  }

  if (req.method === "DELETE") {
    const client = await MongoClient.connect(mongoURI);
    const db = client.db(); // get ahold of that database
    // See if this email has been used in the database already
    const check = await db
      .collection(cluster.collection)
      .findOne({ email: req.body.email });
    // If a doc with that email does exist, delete it
    if (check) {
      await db.collection(cluster.collection).deleteOne({ _id: check._id });
      client.close();
      res.status(200).json({ message: "DELETE complete" });
      return;
    }
    // If a doc with that email does not exist, return an error
    if (!check) {
      client.close();
      res.status(404).json({ message: "No account found for this email" });
      return;
    }
  } 
  else {
    res
      .status(404)
      .json({ message: "No useful actions for that request type!" });
  }
}

// All data inside the API route is private (good b/c we have credentials here)

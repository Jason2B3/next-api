import { MongoClient } from "mongodb";

export default async function handler(req, res) {
  const cluster = {
    username: "JasonAdmin",
    mongoPassword: "2BReborn",
    database: "email-list",
    collection: "demo2",
  };
  const mongoURI = `mongodb+srv://JasonAdmin:${cluster.mongoPassword}@cluster0.ufiop.mongodb.net/${cluster.database}?retryWrites=true&w=majority`;

  if (req.method === "POST") {
    // Organize the data you made the request with
    const feedbackObj = {
      email: req.body.email,
      comment: req.body.comment,
    };
    //% Error handling Part 1: try/catch in case database connect fails
    let client;
    try {
      client = await MongoClient.connect(mongoURI);
    } catch (err) {
      res.status(500).json({ message: "Could not connect to database" });
      return;
    }
    const db = client.db(); // get ahold of that database
    //% Error handling part 2: In case database lookup fails
    //% See if this email has been used in the database already
    let check;
    try {
      check = await db
        .collection(cluster.collection)
        .findOne({ email: req.body.email });
    } catch (err) {
      client.close();
      res
        .status(500)
        .json({ message: "Account uniqueness verification failed!" });
      return;
    }
    //% Error handling 3: In case database insertion fails
    //% Check if a doc with that email exists yet
    //% (check=null if it doesn't). Create a new doc in this case
    if (!check) {
      try {
        await db.collection(cluster.collection).insertOne(feedbackObj);
        client.close();
        res.status(200).json({ message: "POST complete" });
        return;
      } catch (err) {
        client.close();
        res.status(500).json({ message: "Account creation failed!" });
        return;
      }
    }
    //% Error handling 4: In case update operation fails
    //% If a doc with that email does exist, update it instead of creating a new doc
    if (check) {
      try {
        await db
          .collection(cluster.collection)
          .updateOne({ _id: check._id }, { $set: feedbackObj });
        client.close();
        res.status(200).json({ message: "UPDATE complete" });
        return;
      } catch (error) {
        client.close();
        res.status(500).json({ message: "Account update failed!" });
        return;
      }
    }
  }

  if (req.method === "DELETE") {
    //% Error handling Part 1: In case database connect fails
    let client;
    try {
      client = await MongoClient.connect(mongoURI);
    } catch (err) {
      res.status(500).json({ message: "Could not connect to database" });
      return;
    }
    const db = client.db(); // get ahold of that database
    //% Error handling Part 2: In case database find fails
    //% See if this email has been used in the database already
    let check;
    try {
      check = await db
        .collection(cluster.collection)
        .findOne({ email: req.body.email });
    } catch (err) {
      client.close();
      res.status(500).json({ message: "Unique account verification failed!" });
      return;
    }
    //% Error handling Part 3: In case database doc delete fails
    // If a doc with that email does exist, delete it
    if (check) {
      try {
        await db.collection(cluster.collection).deleteOne({ _id: check._id });
        client.close();
        res.status(200).json({ message: "DELETE complete" });
        return;
      } catch (err) {
        client.close();
        res.status(500).json({ message: "Account deletion failed!" });
        return;
      }
    }
    // If a doc with that email does not exist, return an error
    if (!check) {
      client.close();
      res.status(404).json({ message: "No account found for this email" });
      return;
    }
  } else {
    res
      .status(404)
      .json({ message: "No useful actions for that request type!" });
  }
}

// All data inside the API route is private (good b/c we have credentials here)

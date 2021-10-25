import { buildFeedbackPath, extractFeedback } from "./feedback";
import fs from "fs";
import path from "path";

export default function handler(req, res) {
  //% GET action: Retreive one array entry
  if (req.method === "GET") {
    // Get the query string from the request made to this file
    const email = req.query.email;
    // Create a filepath to the json file, then read it
    const filePath = buildFeedbackPath();
    const jsData = extractFeedback(filePath); // data in JS format
    // Extract ONE array entry from the JSON data returned to us in JS form
    const arrayEntry = jsData.find((ent) => {
      return ent.email === email;
    });
    res.status(200).json({ entry: arrayEntry }); // return that entry
  }
  //% DELETE action: delete one array entry
  if (req.method === "DELETE") {
    // Get the query string from the request made to this file
    const email = req.query.email;
    // Create a filepath to the json file, then read it
    const filePath = buildFeedbackPath();
    const jsData = extractFeedback(filePath);
    // Remove one array entry from the JS data, based on the request's query string
    const entryIndexNumber = jsData.findIndex((ent) => {
      return ent.email === email; // [email] must match the JSON array entry's email KVP
    });
    if (entryIndexNumber !== -1) jsData.splice(entryIndexNumber, 1);

    // Overwrite the original JSON file with your updated data
    fs.writeFileSync(filePath, JSON.stringify(jsData));
    res.status(201).json({ message: "Array entry removed" });
  }
}

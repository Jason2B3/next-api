import fs from "fs";
import path from "path";

//# Create our API Route File (no syntax inside here is public)
export default function handler(req, res) {
  if (req.method === "POST") {
    // Extract data from incoming POST request
    const email = req.body.email;
    const feedbackText = req.body.text;
    // Reformat/organize the data sent to this function by the request
    const newFeedback = {
      id: new Date().toISOString(), //@ dummy ID value for development only
      email: email,
      text: feedbackText,
    };
    // Store the reformatted data object in a file or database
    const filePath= path.join(process.cwd(), 'data', "feedback.json") // 1
    const jsonData= fs.readFileSync(filePath) // 2
    const jsData= JSON.parse(jsonData) // 3
    jsData.push(newFeedback) // 4
    fs.writeFileSync(filePath, JSON.stringify(jsData)) // 5 
    res.status(200).json({message: 'New resources created!'}) // 6
  } else{
    res.status(404).json({message: 'Did not code any useful actions for that request type!'})
  }

} 

//# Explanation for storing the reformatted data
// 1-2) Create a filepath to your local JSON file then read it
// 3) Convert the JSON file data into JS, 
// 4) Add to it using .push (feedback.json is an array, not an object. Just look)
// 5.0) Convert your updated jsonData object back to JSON format
// 5.1) Overwrite the file that filepath points to with your updated newly-JSON data object

// 6) Send a response object back with the 201 success code which is often sued for POST requests
//    Can also send back the data we updated our json file with if you want 
//    res.status(404).json({message: '', data: jsData})


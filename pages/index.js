import React, { useRef, useState, useEffect } from "react";
import classes from "./index.module.css";
import { MongoClient } from "mongodb";

export async function getServerSideProps() {
  // READ our database on startup 
  // Can't fetch() API routes directly in pre-render methods, so we write our code manually)
  const cluster = {
    username: "JasonB",
    mongoPassword: "TM01Focus",
    database: "email-list",
    collection: "demo2",
  };
  const mongoURI = `mongodb+srv://JasonB:${cluster.mongoPassword}@first-cluster.g9k83.mongodb.net/${cluster.database}?retryWrites=true&w=majority`;

  const client = await MongoClient.connect(mongoURI);
  const db = client.db(); // get ahold of that database
  const collection = db.collection(cluster.collection);
  const results = await collection.find().sort().toArray(); // can add .limit() before .toArray()
  // Bug workaround ▼▼ (just parse your JSON-ified return from the database)
  const parsedResults = JSON.parse(JSON.stringify(results));
  client.close(); // close the database instance
  return {
    props: { mongoData: parsedResults },
  };
}

function HomePage(props) {
  const emailInputRef = useRef();
  const feedbackInputRef = useRef();

  // CREATE a new doc when we submit using our form
  // UPDATE if the email is already in the list
  const submitFormHandler = async function (event) {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredFeedback = feedbackInputRef.current.value;

    const response = await fetch("/api/mongo/crud", {
      method: "POST",
      body: JSON.stringify({
        email: enteredEmail, // convert the data you're storing into JSON
        comment: enteredFeedback,
      }),
      headers: { "Content-Type": "application/json" },
    });
    const parsed = await response.json();
    console.log(parsed);
  }; // skipped validation for email/password


  // DELETE if you hit the remove button
  const removeHandler= async function(){

  }
  return (
    <>
      <section className={classes.overall}>
        <h1>The Home Page</h1>
        <div>
          <label htmlFor="email">Your Email Address</label>
          <input type="email" id="email" ref={emailInputRef} />
        </div>
        <div>
          <label htmlFor="feedback">Your Feedback</label>
          <input id="feedback" rows="5" ref={feedbackInputRef} />
        </div>
        <button onClick={submitFormHandler}>Send Feedback</button>
        <button onClick={removeHandler}>Remove Feedback from specified email</button>
      </section>
      <p className={classes.overall}>ALL DATABASE DOCUMENTS:</p>
      {props.mongoData.map((ent, id) => {
        return <code className={classes.overall}>{JSON.stringify(ent)}</code>;
      })}
    </>
  );
}

export default HomePage;

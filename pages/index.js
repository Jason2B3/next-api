import React, { useRef, useState, useEffect } from "react";
import classes from "./index.module.css";

import { MongoClient } from "mongodb";

export async function getStaticProps() {
  // READ our database on startup
  // Can't fetch() API routes directly in pre-render methods, so we write our code manually)
  const cluster = {
    username: "JasonAdmino",
    mongoPassword: "2BReborn",
    database: "email-list",
    collection: "demo2",
  };
  const mongoURI = `mongodb+srv://${cluster.username}:${cluster.mongoPassword}@cluster0.ufiop.mongodb.net/${cluster.database}?retryWrites=true&w=majority`;
  let client;
  try {
    client = await MongoClient.connect(mongoURI);
  } catch (err) {
    return {
      props: { mongoData: null, error: "Could not connect to database" },
      // create some conditional JSX if props.error exists
    };
  }
  const db = client.db(); // get ahold of that database
  let collection, results;
  try {
    collection = db.collection(cluster.collection);
    results = await collection.find().sort().toArray(); // can add .limit() before .toArray()
  } catch (err) {
    return {
      props: { mongoData: null, error: "Could not read database" },
      // create some conditional JSX if props.error exists
    };
  }
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

  // CREATE or UPDATE a doc when we submit, depending on if the email's been used already
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

  // DELETE a doc if the email field contains an email you've used for a comment
  const removeHandler = async function (event) {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const response = await fetch("/api/mongo/crud", {
      method: "DELETE",
      body: JSON.stringify({ email: enteredEmail }),
      headers: { "Content-Type": "application/json" },
    });
    const parsed = await response.json();
    console.log(parsed);
  };

  if (props.error) return <p>{props.error}</p>;

  return (
    <>
      <section className={classes.overall}>
        <h1>Perform CRUD Operations!</h1>
        <div>
          <label htmlFor="email">Your Email Address</label>
          <input type="email" id="email" ref={emailInputRef} />
        </div>
        <div>
          <label htmlFor="feedback">Your Feedback</label>
          <input id="feedback" rows="5" ref={feedbackInputRef} />
        </div>
        <button onClick={submitFormHandler}>Send Feedback</button>
        <button onClick={removeHandler}>
          Remove Feedback from specified email
        </button>
      </section>

      <p className={classes.overall}>ALL DATABASE DOCUMENTS:</p>
      {props.mongoData.map((ent, id) => {
        return (
          <code key={id} className={classes.overall}>
            {JSON.stringify(ent)}
          </code>
        );
      })}
    </>
  );
}

export default HomePage;

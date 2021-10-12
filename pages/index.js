import React, { useRef, useState } from "react";
import classes from "./index.module.css";
// ▼ ▼ Hidden from client side if only used inside getStaticProps or getServerSideProps
import { buildFeedbackPath, extractFeedback } from "../pages/api/feedback";
import EmailListItem from "../components/EmailListItem";

export function getStaticProps() {
  // Use helper functions to make a GET request to our local file feedback.json
  const filePath = buildFeedbackPath();
  const data = extractFeedback(filePath);
  // Feed the data we retreive as props for the component function
  return {
    props: { feedbackItems: data },
  };
}

function HomePage(props) {
  console.log(props.feedbackItems);
  const [show, setShow] = useState(null);
  const emailInputRef = useRef();
  const feedbackInputRef = useRef();

  const submitFormHandler = function (event) {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredFeedback = feedbackInputRef.current.value;
    // Make a request to your API route in api/feedback.js
    // Should add new array entries for each feedback submission
    fetch("/api/feedback", {
      method: "POST", //we coded API actions for this request type
      body: JSON.stringify({
        email: enteredEmail, // convert the data you're storing into JSON
        text: enteredFeedback,
      }),
      headers: { "Content-Type": "application/json" },
    });
  }; // skipped validation for email/password

  const viewFeedbackHandler = async function () {
    const response = await fetch("/api/feedback");
    const parsedData = await response.json();
    console.log(parsedData);
    setShow(parsedData); // show data on the webpage
  };

  return (
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
      <button onClick={viewFeedbackHandler}>View Existing Feedback</button>
      <code>{show ? JSON.stringify(show) : ""}</code>
      {props.feedbackItems.map((ent, ind) => {
        return <EmailListItem key={ind} entry={ent} index={ind} />;
      })}
    </section>
  );
}

export default HomePage;

import classes from "./index.module.css";
import { useRef } from "React";

function HomePage() {
  const emailInputRef = useRef();
  const feedbackInputRef = useRef();

  function submitFormHandler(event) {
    event.preventDefault();
    const enteredEmail = emailInputRef.current.value;
    const enteredFeedback = feedbackInputRef.current.value;
  } // skipped validation

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
      <button>Send Feedback</button>
    </section>
  );
}

export default HomePage;

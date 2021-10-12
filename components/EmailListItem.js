import React, { useState } from "react";

export default function EmailListItem({ entry }) {
  // entry: one of the JSON array entries
  const [show, setShow] = useState(null);

  const extractHandler = async function () {
    // Select the correct array entry according to the email the button is for
    // Then, make a GET request to [email].js
    const response = await fetch(`/api/${entry.email}`);
    const parsedData = await response.json();
    setShow(parsedData);
  };

  const deleteHandler = async function () {
    // Select the correct array entry according to the email the button is for
    // Then, make a DELETE request to [email].js
    const response = await fetch(`/api/${entry.email}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify([]), // the argument doesn't seem to matter
    });
    if (!response.ok) throw new Error("deletion failed");
    setShow(null);
    // NOTE: Once a list item is removed from feedback.json , you need to reload the page to notice
    // could fix this, but that's not the focus of this lesson
  };

  return (
    <>
      <li>
        {entry.email}{" "}
        <button onClick={extractHandler}>
          Show array entry details (below)
        </button>
        <button onClick={deleteHandler}>Delete array entry</button>
      </li>
      <code>{show ? JSON.stringify(show) : ""}</code>
    </>
  );
}
// We could use the JSON dat

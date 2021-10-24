import React from "react";

// export async function getServerSideProps(context) {
//   const response = await fetch("/api/mongo");
//   const parsed= await response.json()
//   return { props: { parsed } };
// }

function mongotest(props) {
  const handler = async function (e) {
    const response = await fetch("/api/mongo");
    const parsed = await response.json();
    console.log(parsed);
  };

  return <button onClick={handler}>Read from Mongo DB</button>;
}

export default mongotest;

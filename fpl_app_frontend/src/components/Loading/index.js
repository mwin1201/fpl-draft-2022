import React from "react";
import Spinner from "react-bootstrap/Spinner";

// Full-page loading state with a centered spinner and a readable message.
const Loading = ({ message = "Loading..." }) => (
  <main>
    <div className="loading-screen">
      <Spinner animation="border" variant="success" role="status" />
      <span>{message}</span>
    </div>
  </main>
);

export default Loading;

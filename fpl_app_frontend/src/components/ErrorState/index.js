import React from "react";

// Full-page error state rendered as a simple bordered card.
const ErrorState = ({
  title = "Something went wrong",
  message = "Please try refreshing your screen.",
}) => (
  <main>
    <div className="error-screen">
      <h2>{title}</h2>
      <p>{message}</p>
    </div>
  </main>
);

export default ErrorState;

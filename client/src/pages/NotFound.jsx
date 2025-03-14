import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="page-container">
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/dashboard">
        <button>Go Back to Dashboard</button>
      </Link>
    </div>
  );
};

export default NotFound;

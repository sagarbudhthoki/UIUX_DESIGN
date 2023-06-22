import React from "react";
import { Link } from "react-router-dom";
import NotFound from "../../images/notfound.png";
import Button from "react-bootstrap/Button";

const PageNotFound = () => {
  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img src={NotFound} alt="not found" />
      </div>

      <div className="text-center">
        <h1>404 - Page Not Found</h1>
        <p>The page you are looking for does not exist.</p>
      </div>

      <Link
        style={{
          justifyContent: "center",
          display: "flex",
          textDecoration: "none",
        }}
        to="/"
      >
        <Button className="my-2" contained="outlined-primary">
          GoBack
        </Button>
      </Link>
    </>
  );
};

export default PageNotFound;

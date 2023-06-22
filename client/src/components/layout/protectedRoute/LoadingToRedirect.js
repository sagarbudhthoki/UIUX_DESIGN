import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoadingToRedirect = () => {
  const [count, setCount] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);

    count === 0 && navigate("/login");
    return () => clearInterval(interval);
  }, [count, navigate]);

  return (
    <>
      <div style={{ textAlign: "center", marginTop: "40px" }}>
        <h2 style={{ color: "#f44336" }}>Unauthorized Access</h2>
        <p style={{ fontSize: "20px", marginBottom: "20px" }}>
          You do not have permission to access this resource.
        </p>
        <h3>Redirecting you in {count} seconds...</h3>
      </div>
    </>
  );
};

export default LoadingToRedirect;

import React from "react";
import { useSelector } from "react-redux";
// import { Navigate } from "react-router-dom";
import LoadingToRedirect from "./LoadingToRedirect";

const ProtectedRoute = ({ children, isAdmin }) => {
  const { user } = useSelector((state) => ({
    ...state.auth,
  }));

  if (isAdmin === true && user?.role !== "admin") {
    return user ? children : <LoadingToRedirect />;
  }
  return user ? children : <LoadingToRedirect />;

  // return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;

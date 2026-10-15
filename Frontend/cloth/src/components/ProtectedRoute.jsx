import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user } = useContext(AuthContext);

  // Not logged in → go to register
  if (!user) {
    return <Navigate to="/register" replace />;
  }

  return children;
}

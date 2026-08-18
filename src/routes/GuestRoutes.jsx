import { Navigate } from "react-router-dom";
import { useAuth } from "@/hooks";

export default function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks";
import {LoadingAnimation} from "@/components/ui"
export default function ProtectedRoute({ children }) {
  const { initialized, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!initialized) {
    return (
      <LoadingAnimation/>
    );
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/signin"
        replace
        state={{ from: location }}
      />
    );
  }

  return children;
}
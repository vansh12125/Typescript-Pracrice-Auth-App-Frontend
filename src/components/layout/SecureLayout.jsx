import { Outlet } from "react-router-dom";
import AuthInitializer from "@/routes/AuthInitializer";
import ProtectedRoute from "@/routes/ProtectedRoute";

export default function SecureLayout() {
  return (
    <AuthInitializer>
      <ProtectedRoute>
        <Outlet />
      </ProtectedRoute>
    </AuthInitializer>
  );
}

import { Outlet } from "react-router-dom";
import { GuestRoutes } from "@/routes";

export default function AuthLayout() {
  return (
    <GuestRoutes>
      <Outlet />
    </GuestRoutes>
  );
}

import { createBrowserRouter } from "react-router-dom";
import { authRoutes, publicRoutes, securedRoutes } from "@/routes/";
import { InternalError } from "@/pages/error";
import { PublicLayout, AuthLayout, SecureLayout,MainLayout } from "@/components/layout";

export const router = createBrowserRouter([
  {
    element:<MainLayout/>,
    errorElement: <InternalError />,
    children: [
      {
        element: <PublicLayout />,
        children: publicRoutes,
      },
      {
        element: <AuthLayout />,
        children: authRoutes,
      },
      {
        element: <SecureLayout />,
        children: securedRoutes,
      },
    ],
  },
]);

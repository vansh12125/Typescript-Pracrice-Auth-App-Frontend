import { Login, Register, OAuthSuccess } from "@/pages/auth";

export const authRoutes = [
  {
    path: "signin",
    element: <Login />,
  },
  {
    path: "signup",
    element: <Register />,
  },
  {
    path: "oauth/success",
    element: <OAuthSuccess />,
  },
  
];

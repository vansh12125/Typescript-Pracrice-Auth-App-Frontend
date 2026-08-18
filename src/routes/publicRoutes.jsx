import { Home, About, Contacts, NotFound ,Faqs,Terms,Privacy,CookieMatrix} from "@/pages/";

export const publicRoutes = [
  {
    index: true,
    element: <Home />,
  },
  {
    path: "about",
    element: <About />,
  },
  {
    path: "contacts",
    element: <Contacts />,
  },
  {
    path: "faqs",
    element: <Faqs />,
  },
  {
    path: "privacy-policy",
    element: <Privacy />,
  },
  {
    path: "terms-of-service",
    element: <Terms />,
  },
  {
    path: "cookie-matrix",
    element: <CookieMatrix />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

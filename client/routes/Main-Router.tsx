import { createBrowserRouter } from "react-router-dom";
import Root from "@client/Root";
import About from "pages/About";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        path: "about",
        element: <About />,
      },
    ],
  },
]);

export default router;

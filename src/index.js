import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import MemberList from "./components/member-list";
import "./index.css";

const router = createBrowserRouter([{ path: "/", element: <MemberList /> }]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router}></RouterProvider>
);

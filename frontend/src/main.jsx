import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { AuthProvider } from "./hooks/useAuth";
import { MainContextProvider } from "./hooks/mainContext.jsx";

import App from "./App.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MainContextProvider>
      <RouterProvider router={router}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </RouterProvider>
    </MainContextProvider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { AuthProvider } from "./hooks/useAuth";

import App from "./App.jsx";
import "./index.css";
import "./app.css";


//import { MainContextProvider } from "./context/mainContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  //<React.StrictMode>
    <RouterProvider router={router}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </RouterProvider>
  //</React.StrictMode>
);

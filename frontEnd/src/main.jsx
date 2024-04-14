import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";

import { BrowserRouter } from "react-router-dom";
import { MainContextProvider } from "./context/mainContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <MainContextProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </MainContextProvider>
);

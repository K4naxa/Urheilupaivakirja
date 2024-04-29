import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { AuthProvider } from "./hooks/useAuth";
import { MainContextProvider } from "./hooks/mainContext.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import App from "./App.jsx";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <MainContextProvider>
        <RouterProvider router={router}>
          <AuthProvider>
            <App />
            <ReactQueryDevtools initialIsOpen={true} />
          </AuthProvider>
        </RouterProvider>
      </MainContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { AuthProvider } from "./hooks/useAuth";
import { MainContextProvider } from "./hooks/mainContext.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastProvider } from "./hooks/toast-messages/ToastProvider";

import App from "./App.jsx";
import "./index.css";

// TODO: CSS TO TAILWIND 
import "./hooks/toast-messages/toast.css";
import "./components/confirm-modal/confirmModal.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
  //<React.StrictMode>
  <QueryClientProvider client={queryClient}>
    <MainContextProvider>
      <ToastProvider>
        <RouterProvider router={router}>
          <AuthProvider>
            <App />
          </AuthProvider>
        </RouterProvider>
      </ToastProvider>
    </MainContextProvider>
  </QueryClientProvider>
  //</React.StrictMode>
);

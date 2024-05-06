import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./router";
import { AuthProvider } from "./hooks/useAuth";
import { MainContextProvider } from "./hooks/mainContext.jsx";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
//import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastProvider } from "./hooks/toast-messages/ToastProvider";
import { JournalModalProvider } from "./hooks/useJournalModal.jsx";
import { DateModalProvider } from "./hooks/useDateModal.jsx";

import App from "./App.jsx";
import "./index.css";

// TODO: CSS TO TAILWIND
import "./hooks/toast-messages/toast.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
    <QueryClientProvider client={queryClient}>
      <MainContextProvider>
        <ToastProvider>
          <JournalModalProvider>
            <DateModalProvider>
              <RouterProvider router={router}>
                <AuthProvider>
                  <App />
                </AuthProvider>
              </RouterProvider>
            </DateModalProvider>
          </JournalModalProvider>
        </ToastProvider>
      </MainContextProvider>
    </QueryClientProvider>
);

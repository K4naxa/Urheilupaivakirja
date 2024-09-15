import { createContext, useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
const AuthContext = createContext();
import { useQueryClient } from "@tanstack/react-query";
import userService from "../services/userService";
import { useToast } from "./toast-messages/useToast";
import { resetAxiosInstance } from "../services/apiClient";
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();
  const { addToast } = useToast();

  const queryClient = useQueryClient();
  // call this function to sign in user
  const login = async (data) => {
    setUser(data);
    if (data.email_verified === false) {
      navigate("/vahvista-sahkoposti");
    } else {
      switch (data.role) {
        case 1:
          navigate("/opettaja");
          break;
        case 2:
          navigate("/vierailija");
          break;
        case 3:
          navigate("/");
          break;
      }
    }
  };
  // call this function to sign out logged in user
  const logout = async () => {
    try {
      setUser(null);

      // Invalidate queries to ensure no stale data
      await userService.logout();
      queryClient.removeQueries();
      resetAxiosInstance();
      // Clear Axios state (interceptors, failed requests)
      addToast("Olet kirjautunut ulos", { style: "success" });
      navigate("/kirjaudu", { replace: true });
    } catch (error) {
      addToast("Error logging out. Please try again.", { style: "error" });
      console.error("Logout error:", error);
    }
  };

  const logoutAll = async () => {
    try {
      setUser(null);
      await userService.logoutAll();
      queryClient.invalidateQueries();
      clearUserData();
      addToast("Olet kirjautunut ulos kaikista laitteista", {
        style: "success",
      });
      navigate("/kirjaudu", { replace: true }), [queryClient, navigate];
    } catch (error) {
      // Handle any errors during the logout process
      addToast("Error logging out. Please try again.", { style: "error" });
      console.error("Logout error:", error);
    }
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      logoutAll,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const clearUserData = () => {
  window.localStorage.removeItem("user");
  window.sessionStorage.removeItem("user");
};

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (value == null) {
    throw new Error("useAuth must be used within a <AuthProvider>");
  }

  return value;
};

import { createContext, useContext, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
const AuthContext = createContext();
import { useQueryClient } from "@tanstack/react-query";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

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
  const logout = useCallback(() => {
    console.log("Logging out");
    setUser(null);
    queryClient.invalidateQueries();
    clearUserData();
    navigate("/kirjaudu", { replace: true }), [queryClient, navigate];
  });

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const clearUserData = () => {
  // Clear access and refresh tokens stored in cookies
  document.cookie =
    "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie =
    "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

  // Clear any user-related data in local storage
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
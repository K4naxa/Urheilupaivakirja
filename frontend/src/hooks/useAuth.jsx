import { createContext, useContext, useMemo } from "react";
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
  const logout = () => {
    setUser(null);
    queryClient.invalidateQueries();
    window.localStorage.removeItem("user");
    window.sessionStorage.removeItem("user");
    navigate("/kirjaudu", { replace: true });
  };

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

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (value == null) {
    throw new Error("useToast must be used within a <ToastProvider>");
  }

  return value;
};

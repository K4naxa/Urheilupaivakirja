import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

    // call this function to sign in user
  const login = async (data) => {
    setUser(data);
    console.log(data)
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
  };
  // call this function to sign out logged in user
  const logout = () => {
    setUser(null);
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

// custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

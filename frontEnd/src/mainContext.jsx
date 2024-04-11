import { createContext, useState, useEffect } from "react";
import trainingService from "./Services/trainingService";

export const MainContext = createContext();

const useReloadOnTokenChange = () => {
  const { token } = useContext(MainContext);
};

export const MainContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");

  const [token, setToken] = useState(null);

  //TODO: redirect to homepage after login

  // Check if user token is in local storage
  const userHook = () => {
    let loggedUserJSON = null;
    if (window.sessionStorage.getItem("urheilupaivakirjaToken"))
      loggedUserJSON = window.sessionStorage.getItem("urheilupaivakirjaToken");
    if (window.localStorage.getItem("urheilupaivakirjaToken"))
      loggedUserJSON = window.localStorage.getItem("urheilupaivakirjaToken");
    {
      if (loggedUserJSON) {
        const user = JSON.parse(loggedUserJSON);
        setToken(user.token);
        setLoggedIn(true);
        setUserRole(user.role);
        console.log("logged in from local storage as userRole:", user.role);
      }
    }
  };

  const startHook = () => {
    if (!token) return;

    trainingService.setToken(token);
  };

  // tarkistaa onko käyttäjä kirjautunut kun sivu ladataan
  useEffect(() => {
    userHook();
  }, []);

  // asettaa tokenin käyttöön kun se on saatu
  useEffect(() => {
    startHook();
  }, [token]);

  useEffect(() => {
    const handleTokenChange = () => {
      window.location.reload();
    };
    // Listen to changes in the token
    window.addEventListener("tokenchange", handleTokenChange);

    return () => {
      // Clean up event listener on unmount
      window.removeEventListener("tokenchange", handleTokenChange);
    };
  }, [token]);

  return (
    <MainContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        userRole,
        setUserRole,
        userName,
        setUserName,
        token,
        setToken,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

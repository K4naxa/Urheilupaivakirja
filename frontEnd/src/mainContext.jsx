import { createContext, useState } from "react";

export const MainContext = createContext();

export const MainContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(true);
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");
  const [userToken, setUserToken] = useState("");

  return (
    <MainContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        userRole,
        setUserRole,
        userName,
        setUserName,
        userToken,
        setUserToken,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

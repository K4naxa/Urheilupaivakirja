import { createContext, useState } from "react";

export const MainContext = createContext();

export const MainContextProvider = ({ children }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userType, setUserType] = useState("");
  const [userName, setUserName] = useState("");
  const [userToken, setUserToken] = useState("");

  return (
    <MainContext.Provider
      value={{
        loggedIn,
        setLoggedIn,
        userType,
        setUserType,
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

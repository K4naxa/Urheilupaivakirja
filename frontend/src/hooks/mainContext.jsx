import React, { createContext, useContext, useEffect, useState } from "react";

const MainContext = createContext();
export const MainContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const localTheme = localStorage.getItem("theme") || "light";
    setTheme(localTheme);
  }, []);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    localStorage.setItem("theme", theme);
  };

  return (
    <MainContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </MainContext.Provider>
  );
};
export const useMainContext = () => {
  return useContext(MainContext);
};

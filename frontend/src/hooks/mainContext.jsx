import { createContext, useContext, useEffect, useState } from "react";
import trainingService from "../services/trainingService";

const MainContext = createContext();

export const MainContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [showDate, setShowDate] = useState(new Date());

  useEffect(() => {
    const localTheme = localStorage.getItem("theme") || "light";
    setTheme(localTheme);
    document.documentElement.setAttribute("data-theme", localTheme);
  }, []);

  useEffect(() => {
    document.documentElement.style.backgroundColor = `var(--color-bg-primary)`;
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  return (
    <MainContext.Provider
      value={{
        theme,
        toggleTheme,
        showDate,
        setShowDate,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  return useContext(MainContext);
};

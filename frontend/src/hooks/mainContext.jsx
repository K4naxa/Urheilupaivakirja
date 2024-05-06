import { createContext, useContext, useEffect, useState } from "react";
import trainingService from "../services/trainingService";

const MainContext = createContext();

export const MainContextProvider = ({ children }) => {
  const [theme, setTheme] = useState("light");
  const [showDate, setShowDate] = useState(new Date());
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const localTheme = localStorage.getItem("theme") || "light";
    setTheme(localTheme);
    document.documentElement.setAttribute("data-theme", localTheme);
  }, []);

  useEffect(() => {
    const handleResize = () => setScreenWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
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
        screenWidth,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};

export const useMainContext = () => {
  return useContext(MainContext);
};

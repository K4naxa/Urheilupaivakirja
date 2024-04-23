import { useMainContext } from "../../hooks/mainContext";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useMainContext();

  return (
    <div>
      <button
        className={`bg-${theme === "light" ? "primary-light" : "primary-dark"}`}
        onClick={toggleTheme}
      >
        Toggle theme
      </button>
      <p>Current theme: {theme}</p>
    </div>
  );
};

export default ThemeSwitcher;

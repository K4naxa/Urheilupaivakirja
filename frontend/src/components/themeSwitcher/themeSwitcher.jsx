import { useMainContext } from "../../hooks/mainContext";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useMainContext();

  return (
    <div>
      <button
        className={`bg-primary-${theme} text-primary-${theme}`}
        onClick={toggleTheme}
      >
        Toggle theme
      </button>
      <p className={`text-primary-${theme}`}>Current theme: {theme}</p>
    </div>
  );
};

export default ThemeSwitcher;

import { useMainContext } from "../../hooks/mainContext";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useMainContext();

  return (
    <div>
      <button className={` text-textPrimary`} onClick={toggleTheme}>
        Toggle theme
      </button>
      <p className={`text-textPrimary`}>Current theme: {theme}</p>
    </div>
  );
};

export default ThemeSwitcher;

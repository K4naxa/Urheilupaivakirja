import { useMainContext } from "../../hooks/mainContext";
import { FiMoon } from "react-icons/fi";
import { FiSun } from "react-icons/fi";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useMainContext();

  return (
    <div>
      <button
        className={` text-textPrimary bg-bgkPrimary z-0 rounded-full text-2xl`}
        onClick={toggleTheme}
      >
        {theme === "dark" ? <FiSun /> : <FiMoon />}
      </button>
    </div>
  );
};

export default ThemeSwitcher;

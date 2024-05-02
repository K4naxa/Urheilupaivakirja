import { useMainContext } from "../hooks/mainContext";
import { FiMoon } from "react-icons/fi";
import { FiSun } from "react-icons/fi";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useMainContext();

  return (
    <div className="flex w-full h-full">
      <button
        className={` text-textPrimary rounded-full text-xl`}
        onClick={toggleTheme}
      >
        {theme === "dark" ? <FiSun /> : <FiMoon />}
      </button>
    </div>
  );
};

export default ThemeSwitcher;

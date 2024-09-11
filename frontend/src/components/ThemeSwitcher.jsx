import { useMainContext } from "../hooks/mainContext";
import { FiMoon } from "react-icons/fi";
import { FiSun } from "react-icons/fi";
import cc from "../utils/cc";

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useMainContext();

  return (
    <div
      className={`flex w-[26px] select-none h-[56px] border border-btnGray rounded-t-full rounded-b-full justify-center relative transition-transform duration-300 ease-in-out transition-colors duration-0 hover:cursor-pointer
      bg-bgPrimary shadow-md ${theme === "light" ? "" : ""}`}
      onClick={() => toggleTheme()}
    >
      <div
        className={cc(
          "flex bg-primaryColor rounded-full justify-center items-center w-[28px] h-[28px] absolute transition-transform duration-300 ease-in-out",
          theme === "light"
            ? "transform translate-y-0"
            : "transform translate-y-full bg-secondaryColor"
        )}
      >
        {theme === "dark" ? (
          <FiMoon className="text-white" />
        ) : (
          <FiSun className="text-white" />
        )}
      </div>
    </div>
  );
};

export default ThemeSwitcher;

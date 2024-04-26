import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FiLogOut } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";
import { useState } from "react";

import ThemeSwitcher from "../../components/themeSwitcher/themeSwitcher";

const StudentLayout = () => {
  const { logout } = useAuth();
  const [showBar, setShowBar] = useState(false);

  const linkClass = `text-textPrimary px-4 py-2 hover:text-blue-500 px-4 py-2`;

  return (
    <div className="flex flex-col w-full">
      <header
        className={`bg-bgkPrimary flex items-center w-full text-xl relative border-b-2 border-graphPrimary mb-12 max-h-16`}
      >
        <nav id="top-nav" className="  md:flex w-full gap-8 justify-center">
          <div className="hidden md:flex gap-8 justify-center ">
            <Link to="/" className={linkClass}>
              Etusivu
            </Link>
            <Link to="/tiedotteet/" className={linkClass}>
              Tiedotteet
            </Link>
          </div>
          <div className="md:hidden flex items-center gap-2">
            <FiMenu />
          </div>
        </nav>
        <div className=" flex items-center gap-2 right-4 ">
          <div className="m-0 p-0" id="profileButton">
            <Link to="/profiili" className={linkClass}>
              <FiUser />
            </Link>
          </div>
          <div className="m-0 p-0" id="logoutButton">
            <button
              className={linkClass}
              onClick={() => {
                logout();
              }}
            >
              <FiLogOut />
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-[1280px]">
        <Outlet />
        <div className="absolute bottom-2 right-5">
          <ThemeSwitcher />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;

import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FiLogOut } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { useState } from "react";
import { FiMessageSquare } from "react-icons/fi";
import { NavLink } from "react-router-dom";

import ThemeSwitcher from "../../components/themeSwitcher/themeSwitcher";

const StudentLayout = () => {
  const { logout } = useAuth();
  const [showBar, setShowBar] = useState(false);

  const linkClass = `flex flex-col items-center text-textPrimary px-2`;

  return (
    <div className="flex flex-col w-full">
      <header
        className={`hidden bg-bgkPrimary lg:flex items-center w-full text-xl relative border-b-2 border-graphPrimary mb-12 max-h-16`}
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
        </nav>
        <div className=" flex items-center gap-2 right-4 ">
          <div className="m-0 p-0" id="profileButton">
            <NavLink
              to="/profiili"
              className={
                "flex flex-col items-center text-textPrimary px-2 hover:text-bgkSecondary active:text-graphPrimary"
              }
            >
              <FiUser />
            </NavLink>
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
      {/* header for mobile */}

      <header
        className={`lg:hidden bg-bgkPrimary bottom-0  flex items-center w-full text-xl fixed h-16 shadow-upper-shadow `}
      >
        <nav
          id="top-nav"
          className="grid grid-cols-mHeader w-full place-content-center"
        >
          <div className="flex items-center text-2xl justify-around">
            <NavLink to="/" className={linkClass}>
              <FiHome />
              <p className="text-[12px]">Etusivu</p>
            </NavLink>
            <Link to="/tiedotteet/" className={linkClass}>
              <FiMessageSquare />
              <p className="text-[12px]">Viestit</p>
            </Link>
          </div>
          <div className="flex justify-center">
            <button className="size-16 absolute bottom-8 rounded-full bg-bgkSecondary border-t-2 border-graphPrimary text-graphPrimary text-3xl drop-shadow-xl shadow-upper-shadow active:scale-110 duration-100">
              +
            </button>
          </div>
          <div className=" flex items-center justify-around ">
            <div className="m-0 p-0" id="profileButton">
              <Link to="/profiili" className={linkClass}>
                <FiUser />
                <p className="text-[12px]">Käyttäjä</p>
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
                <p className="text-[12px]">Asetukset</p>
              </button>
            </div>
          </div>
        </nav>
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

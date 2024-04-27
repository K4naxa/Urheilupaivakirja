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

  const linkClass = `flex flex-col items-center text-textPrimary hover:text-graphPrimary`;

  return (
    <div className=" flex w-full flex-col">
      <header
        className={`bg-bgkPrimary border-graphPrimary mb-12 hidden w-full 
         items-center justify-between border-b-2 px-4 py-2 text-xl lg:flex`}
      >
        <nav id="top-nav" className="flex justify-center gap-8">
          <div className="text-textPrimary flex justify-center gap-8 ">
            <>Urheilupäiväkirja</>
            <Link to="/" className={linkClass}>
              Etusivu
            </Link>
            <Link to="/tiedotteet/" className={linkClass}>
              Tiedotteet
            </Link>
          </div>
        </nav>
        <div className=" right-4 flex items-center gap-4 ">
          <button className="bg-graphPrimary text-bgkPrimary border-graphPrimary rounded-md border-2 px-4 py-2 drop-shadow-lg hover:border-white">
            + Uusi Merkintä
          </button>

          <ThemeSwitcher />
          <div className="" id="profileButton">
            <NavLink
              to="/profiili"
              className={
                "text-textPrimary hover:text-bgkSecondary active:text-graphPrimary flex flex-col items-center px-2"
              }
            >
              <FiUser />
              <p className="text-[12px]">Käyttäjä</p>
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
              <p className="text-[12px]">Kirjaudu ulos</p>
            </button>
          </div>
        </div>
      </header>
      {/* header for mobile */}

      <header
        className={`bg-bgkPrimary shadow-upper-shadow fixed  bottom-0 flex h-16 w-full items-center text-xl lg:hidden `}
      >
        <nav
          id="top-nav"
          className="grid-cols-mHeader grid w-full place-content-center"
        >
          <div className="flex items-center justify-around text-2xl">
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
            <button className="bg-bgkSecondary border-graphPrimary text-graphPrimary shadow-upper-shadow absolute bottom-8 z-10 size-16 rounded-full border-t-2 text-3xl drop-shadow-xl duration-100 active:scale-110">
              +
            </button>
            <div className=" absolute bottom-0 ">
              <ThemeSwitcher />
            </div>
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
      <main className="mx-1 max-w-[1480px] lg:mx-4">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;

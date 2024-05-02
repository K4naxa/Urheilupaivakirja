import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiLogOut } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";
import { NavLink, Link } from "react-router-dom";
import { useState } from "react";
import { FiSettings } from "react-icons/fi";
import NewJournalEntryPage from "../pages/student/journal-entry/NewJournalEntryPage";
import UnreadNewsIndicator from "../components/UnreadNewsIndicator";

import ThemeSwitcher from "../components/themeSwitcher";

const StudentLayout = () => {
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const linkClass =
    "flex flex-col items-center text-textPrimary py-2 rounded-md text-xl hover:underline decoration-headerPrimary ";
  const linkTextClass = "text-textPrimary items-center text-[12px]";
  return (
    <>
      <header
        className={`bg-bgkPrimary border-graphPrimary fixed-header max-h-20 mb-12 hidden  
    border-b-2 px-4 py-2 text-xl shadow-md lg:flex`}
      >
        <nav id="top-nav" className="flex justify-center gap-8">
          <div className="text-textPrimary flex justify-center gap-8">
            <p className="items-center flex">Urheilupäiväkirja</p>
            <NavLink to="/" className={linkClass}>
              Etusivu
            </NavLink>
            <NavLink to="/tiedotteet/" className={linkClass}>
              Tiedotteet
            </NavLink>
            <UnreadNewsIndicator />
          </div>
        </nav>

        <div className=" right-4 flex items-center gap-4 ">
          <Link to="/merkinnat/uusi">
            <button className="bg-graphPrimary text-bgkPrimary border-graphPrimary rounded-md border-2 px-4 py-2 drop-shadow-lg hover:border-white">
              + Uusi Merkintä
            </button>
          </Link>
          <div>
            <ThemeSwitcher />
          </div>

          {/* Profile button */}
          <NavLink
            to="/profiili"
            className="text-textPrimary hover:text-bgkSecondary active:text-graphPrimary
               flex flex-col items-center px-2"
          >
            <FiUser />
            <p className={linkTextClass}>Käyttäjä</p>
          </NavLink>
          <div className="m-0 p-0" id="logoutButton">
            <button
              className={linkClass}
              onClick={() => {
                logout();
              }}
            >
              <FiLogOut />
              <p className={linkTextClass}>Kirjaudu ulos</p>
            </button>
          </div>
        </div>
      </header>
      {/* header for mobile */}

      <header
        className={`bg-bgkPrimary shadow-upper-shadow fixed left-0  bottom-0 flex h-16 py-8 w-full items-center text-xl lg:hidden`}
      >
        <nav id="top-nav" className="grid-cols-mHeader gap-4 grid w-full">
          <div className="grid grid-cols-2">
            <NavLink to="/" className={linkClass}>
              <FiHome />
              <p className={linkTextClass}>Etusivu</p>
            </NavLink>
            <NavLink to="/tiedotteet/" className={linkClass}>
              <FiMessageSquare />
              <p className={linkTextClass}>Viestit</p>
            </NavLink>
          </div>
          <div className="flex justify-center">
            <button
              className="bg-bgkSecondary border-headerPrimary text-headerPrimary
       shadow-upper-shadow absolute bottom-6 z-10 size-16 rounded-full border-t-2
        text-3xl drop-shadow-xl duration-100 active:scale-110"
            >
              +
            </button>
          </div>
          <div className=" grid grid-cols-2 ">
            <button
              className={linkClass}
              onClick={() => {
                logout();
              }}
            >
              <FiLogOut />
              <p className={linkTextClass}>Logout</p>
            </button>
            <button
              className={
                linkClass +
                `${showUserMenu ? " bg-headerPrimary rounded-b-md rounded-t-none transition-colors duration-200" : " bg-bgkPrimary"}`
              }
              onClick={() => {
                setShowUserMenu(!showUserMenu);
              }}
            >
              <FiUser />
              <p className={linkTextClass}>Käyttäjä</p>
            </button>
          </div>
        </nav>

        {/* Div for user Menu */}
        <div className="absolute bottom-0 flex justify-center w-full">
          {showUserMenu && (
            <div
              className=" bg-headerPrimary rounded-t-md w-full shadow-upper-shadow absolute
 grid grid-cols-mHeader gap-4 bottom-[64px] right-0 l animate-menu-appear-right"
            >
              <div className="grid grid-cols-2">
                <NavLink to="/profiili" className={linkClass}>
                  <FiUser />
                  <p className={linkTextClass}>Profiili</p>
                </NavLink>
                <NavLink to="/asetukset" className={linkClass}>
                  <FiSettings />
                  <p className={linkTextClass}>Asetukset</p>
                </NavLink>
              </div>
              <div></div>
              <div className="grid grid-cols-2 place-items-center">
                <button
                  className={linkClass}
                  onClick={() => {
                    logout();
                  }}
                >
                  <FiLogOut />
                  <p className={linkTextClass}>Kirjaudu ulos</p>
                </button>

                <div className={linkClass}>
                  <ThemeSwitcher />
                </div>
              </div>
            </div>
          )}
        </div>
      </header>
      <main className="mx-1 max-w-[1480px] lg:mx-4 lg:mt-20">
        <Outlet />
      </main>
    </>
  );
};

export default StudentLayout;
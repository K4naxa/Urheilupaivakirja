import "./teacherLayout.css";
import ThemeSwitcher from "../../components/themeSwitcher/themeSwitcher";
import { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { FiLogOut } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";
import { FiGrid } from "react-icons/fi";
import { FiMenu } from "react-icons/fi";
import { FiUserCheck } from "react-icons/fi";
import { MdOutlineGroups } from "react-icons/md";
import { PiStudent } from "react-icons/pi";
import { PiBuildings } from "react-icons/pi";
import { MdOutlineSportsFootball } from "react-icons/md";
import { GrUserNew } from "react-icons/gr";

const TeacherLayout = () => {
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showControlPanel, setShowControlPanel] = useState(false);

  const linkClass =
    "flex flex-col items-center text-textPrimary hover:underline py-2 rounded-md hover:text-headerSecondary text-xl";
  const linkTextClass =
    "text-textPrimary hover:text-bgkSecondary active:text-graphPrimary items-center text-[12px]";
  return (
    <div className="flex flex-col items-center text-textPrimary hover:underline">
      <header
        className={`bg-bgkPrimary border-graphPrimary fixed-header mb-12 hidden 
          border-b-2 px-4 py-2 text-xl shadow-md lg:flex`}
      >
        <nav id="top-nav" className="flex justify-center gap-8 ">
          <div className="text-textPrimary flex justify-center gap-8 ">
            <>Urheilupäiväkirja</>
            <NavLink to="/opettaja/" id="homeLink" className={linkClass}>
              Etusivu
            </NavLink>

            <NavLink
              to="/opettaja/tiedotteet/"
              id="tiedotteetLink"
              className={linkClass}
            >
              Tiedotteet
            </NavLink>

            <NavLink
              to="/opettaja/hyvaksy/"
              id="verifoiLink"
              className={linkClass}
            >
              Verifoi
            </NavLink>

            <NavLink
              to="/opettaja/hallitse/"
              id="controlLink"
              className={linkClass}
            >
              Hallinta
            </NavLink>
          </div>
        </nav>
        <div className=" right-4 flex items-center gap-4 ">
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
        className={`bg-bgkPrimary shadow-upper-shadow fixed  bottom-0 flex w-full items-center text-xl lg:hidden`}
      >
        <nav
          id="top-nav"
          className="grid-cols-5 grid gap-4 w-full place-content-center"
        >
          <NavLink to="/opettaja" className={linkClass}>
            <FiHome />
            <p className={linkTextClass}>Etusivu</p>
          </NavLink>
          <NavLink to="/tiedotteet/" className={linkClass}>
            <FiMessageSquare />
            <p className={linkTextClass}>Tiedotteet</p>
          </NavLink>

          <button
            className={
              linkClass +
              `${showControlPanel ? " bg-headerPrimary rounded-b-md rounded-t-none transition-colors duration-150" : " bg-bgkPrimary"}`
            }
            onClick={() => {
              setShowControlPanel(!showControlPanel);
              setShowMenu(false);
            }}
          >
            <FiGrid />
            <p className={linkTextClass}>Hallinta</p>
          </button>

          <NavLink to="/opettaja/hyvaksy/" className={linkClass}>
            <FiUserCheck />
            <p className={linkTextClass}>Verifoi</p>
          </NavLink>

          <button
            className={
              linkClass +
              `${showMenu ? " bg-headerPrimary rounded-b-md rounded-t-none transition-colors duration-150" : " bg-bgkPrimary"}`
            }
            onClick={() => {
              setShowMenu(!showMenu);
              setShowControlPanel(false);
            }}
          >
            <FiMenu />
            <p className={linkTextClass}>Menu</p>
          </button>
        </nav>

        {/* Div for Control Panel menu*/}
        <div className="absolute bottom-0 flex justify-center w-full">
          {showControlPanel && (
            <div className=" bg-headerPrimary rounded-t-md w-full shadow-upper-shadow absolute grid grid-cols-5 place-items-center bottom-[64px] right-0 l animate-menu-appear-middle">
              <NavLink to="/opettaja/hallitse/lajit" className={linkClass}>
                <MdOutlineSportsFootball />
                <p className={linkTextClass}>Lajit</p>
              </NavLink>
              <NavLink to="/opettaja/hallitse/ryhmat" className={linkClass}>
                <MdOutlineGroups />
                <p className={linkTextClass}>Ryhmät</p>
              </NavLink>
              <NavLink
                to="/opettaja/hallitse/toimipaikat"
                className={linkClass}
              >
                <PiBuildings />
                <p className={linkTextClass}>Toimipaikat</p>
              </NavLink>
              <NavLink
                to="/opettaja/hallitse/vierailijat"
                className={linkClass}
              >
                <GrUserNew />
                <p className={linkTextClass}>Vierailijat</p>
              </NavLink>
              <NavLink
                to="/opettaja/hallitse/opiskelijat"
                className={linkClass}
              >
                <PiStudent />
                <p className={linkTextClass}>Opiskelijat</p>
              </NavLink>
            </div>
          )}
        </div>

        {/* Div for Menu */}
        <div className="absolute bottom-0 flex justify-center w-full">
          {showMenu && (
            <div className=" bg-headerPrimary rounded-t-md w-full shadow-upper-shadow absolute grid grid-cols-4 place-items-center bottom-[64px] right-0 l animate-menu-appear-right">
              <NavLink to="/profiili" className={linkClass}>
                <FiUser />
                <p className={linkTextClass}>Profiili</p>
              </NavLink>
              <NavLink to="/asetukset" className={linkClass}>
                <FiSettings />
                <p className={linkTextClass}>Asetukset</p>
              </NavLink>
              <button
                className={linkClass}
                onClick={() => {
                  logout();
                }}
              >
                <FiLogOut />
                <p className={linkTextClass}>Kirjaudu ulos</p>
              </button>
              <button className={linkClass}>
                <ThemeSwitcher />
                <p className={linkTextClass}>Teema</p>
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="mx-1 max-w-[1480px] lg:mx-4 lg:mt-20">
        <Outlet />
      </main>
    </div>
  );
};

export default TeacherLayout;

import ThemeSwitcher from "../components/themeSwitcher";
import { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
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
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

const TeacherLayout = () => {
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showControlPanel, setShowControlPanel] = useState(false);

  const linkClass =
    "flex flex-col items-center text-textPrimary hover:underline py-2 rounded-md hover:text-headerSecondary text-xl";
  const linkTextClass =
    "text-textPrimary hover:text-bgkSecondary active:text-graphPrimary items-center text-[12px] leading-none mt-2";
  return (
    <div className="text-textPrimary">
      <header
        id="desktop-header"
        className={`bg-bgkPrimary border-graphPrimary fixed-header mb-12 hidden 
          border-b-2 px-4 py-2 text-xl shadow-md max-h-20 lg:flex`}
      >
        <nav id="top-nav" className="flex justify-center gap-8 ">
          <div className="text-textPrimary flex justify-center gap-8 ">
            <div className="items-center flex">Urheilupäiväkirja</div>
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
        <div className="flex items-center gap-8">
          <ThemeSwitcher />

          {/* Profile button */}
          <Menu as="div" className="relative text-textPrimary">
            <Menu.Button
              className={
                "flex flex-col items-center text-textPrimary py-2 gap-2 rounded-md  text-xl"
              }
            >
              <FiUser />
              <p className="text-[12px] leading-none px-2 select-none">
                Käyttäjä
              </p>
            </Menu.Button>{" "}
            <Transition
              as={Fragment}
              enter="transition ease-out duration-100"
              enterFrom="transform opacity-0 scale-95"
              enterTo="transform opacity-100 scale-100"
              leave="transition ease-in duration-75"
              leaveFrom="transform opacity-100 scale-100"
              leaveTo="transform opacity-0 scale-95"
            >
              <Menu.Items className="absolute right-0 w-36 mt-1 origin-top-right bg-bgkSecondary text-lg divide-y divide-headerSecondary rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        to="/profiili"
                        className={`${
                          active
                            ? "bg-headerPrimary text-bgkSecondary"
                            : "text-textPrimary"
                        } group flex rounded-md items-center gap-2 w-full px-2 py-2`}
                      >
                        <FiUser />
                        <p className={"text-[12px]"}>Profiili</p>
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        to="/asetukset"
                        className={`${
                          active
                            ? "bg-headerPrimary text-bgkSecondary"
                            : "text-textPrimary"
                        } group flex rounded-md items-center gap-2 w-full px-2 py-2`}
                      >
                        <FiSettings />
                        <p className={"text-[12px]"}>Asetukset</p>
                      </NavLink>
                    )}
                  </Menu.Item>
                </div>
                <div className="px-1 py-1">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          logout();
                        }}
                        className={`${
                          active
                            ? "bg-headerPrimary text-bgkSecondary"
                            : "text-textPrimary"
                        } group flex rounded-md items-center gap-2 w-full px-2 py-2`}
                      >
                        <FiLogOut />
                        <p className={"text-[12px]"}>Kirjaudu ulos</p>
                      </button>
                    )}
                  </Menu.Item>
                </div>
              </Menu.Items>
            </Transition>
          </Menu>
        </div>
      </header>
      {/* header for mobile */}

      <header
        className={`bg-bgkPrimary shadow-upper-shadow fixed left-0 bottom-0 flex h-16 py-8 w-full items-center text-xl lg:hidden`}
        id="mobile-header"
      >
        <nav id="top-nav" className="grid-cols-5 grid gap-4 w-full">
          <NavLink to="/opettaja" className={linkClass}>
            <FiHome />
            <p className={linkTextClass}>Etusivu</p>
          </NavLink>
          <NavLink to="/tiedotteet/" className={linkClass}>
            <FiMessageSquare />
            <p className={linkTextClass}>Tiedotteet</p>
          </NavLink>

          <NavLink
            to="/opettaja/hallitse/"
            className={
              linkClass +
              `${showControlPanel ? " bg-headerPrimary rounded-b-md rounded-t-none transition-colors duration-150" : " bg-bgkPrimary"}`
            }
            onClick={(e) => {
              e.preventDefault();
              setShowControlPanel(!showControlPanel);
              setShowMenu(false);
            }}
          >
            <FiGrid />
            <p className={linkTextClass}>Hallinta</p>
          </NavLink>

          <NavLink to="/opettaja/hyvaksy/" className={linkClass}>
            <FiUserCheck />
            <p className={linkTextClass}>Verifoi</p>
          </NavLink>

          <button
            className={
              linkClass +
              `${showMenu ? " bg-headerPrimary rounded-b-md rounded-t-none transition-colors duration-200" : " bg-bgkPrimary"}`
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
              <NavLink
                to="/opettaja/hallitse/lajit"
                className={linkClass}
                onClick={() => showControlPanel(false)}
              >
                <MdOutlineSportsFootball />
                <p className={linkTextClass}>Lajit</p>
              </NavLink>
              <NavLink
                to="/opettaja/hallitse/ryhmat"
                className={linkClass}
                onClick={() => showControlPanel(false)}
              >
                <MdOutlineGroups />
                <p className={linkTextClass}>Ryhmät</p>
              </NavLink>
              <NavLink
                to="/opettaja/hallitse/toimipaikat"
                className={linkClass}
                onClick={() => showControlPanel(false)}
              >
                <PiBuildings />
                <p className={linkTextClass}>Toimipaikat</p>
              </NavLink>
              <NavLink
                to="/opettaja/hallitse/vierailijat"
                className={linkClass}
                onClick={() => showControlPanel(false)}
              >
                <GrUserNew />
                <p className={linkTextClass}>Vierailijat</p>
              </NavLink>
              <NavLink
                to="/opettaja/hallitse/opiskelijat"
                className={linkClass}
                onClick={() => showControlPanel(false)}
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
            <div
              className=" bg-headerPrimary rounded-t-md w-full shadow-upper-shadow
             absolute grid grid-cols-4 place-items-center bottom-[64px] right-0
              animate-menu-appear-right"
            >
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
              <div className={linkClass}>
                <ThemeSwitcher />
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex w-full  lg:mt-24 box-content">
        <main className="flex w-full mx-auto max-w-[1480px] pb-16 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;

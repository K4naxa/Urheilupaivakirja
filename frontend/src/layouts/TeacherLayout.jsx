import ThemeSwitcher from "../components/themeSwitcher";
import { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { Link, Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiLogOut } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { FiInbox } from "react-icons/fi";

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
import cc from "../utils/cc";

const TeacherLayout = () => {
  const { logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showControlPanel, setShowControlPanel] = useState(false);

  const linkClass =
    "flex flex-col items-center text-textPrimary py-2 px-4 rounded-md hover:bg-bgGray text-[12px] gap-1";
  const linkTextClass =
    "hover:text-bgSecondary active:text-primaryColor items-center text-[12px] leading-none mt-2";
  let iconSize = 20;
  return (
    <div className="text-textPrimary">
      <header
        id="desktop-header"
        className="fixed-header bg-bgSecondary border border-borderPrimary hidden  
        border-b-2 px-4 py-2 md:flex z-10"
      >
        <nav id="top-nav" className="flex justify-center gap-8 ">
          <div className="text-textPrimary flex justify-center gap-4 ">
            <Link to={"/opettaja/"} className="text-xl flex items-center mx-4">
              Urheilupäiväkirja
            </Link>

            <NavLink
              to="/opettaja/tiedotteet/"
              id="tiedotteetLink"
              className={linkClass}
            >
              <FiInbox size={iconSize} />
              Tiedotteet
            </NavLink>

            <NavLink
              to="/opettaja/hyvaksy/"
              id="verifoiLink"
              className={linkClass}
            >
              <FiUserCheck size={iconSize} />
              Verifoi
            </NavLink>

            <NavLink
              to="/opettaja/hallitse/"
              id="controlLink"
              className={linkClass}
            >
              <FiGrid size={iconSize} />
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
              <FiUser size={iconSize} />
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
              <Menu.Items className="absolute right-0 w-36 mt-1 origin-top-right bg-bgSecondary text-lg divide-y divide-secondaryColor rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="px-1 py-1 ">
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        to="/profiili"
                        className={`${
                          active
                            ? "bg-primaryColor text-bgSecondary"
                            : "text-textPrimary"
                        } group flex rounded-md items-center gap-2 w-full px-2 py-2`}
                      >
                        <FiUser size={iconSize} />
                        <p className={"text-[12px]"}>Profiili</p>
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
                            ? "bg-primaryColor text-bgSecondary"
                            : "text-textPrimary"
                        } group flex rounded-md items-center gap-2 w-full px-2 py-2`}
                      >
                        <FiLogOut size={iconSize} />
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
        className={`bg-bgPrimary shadow-upper-shadow fixed left-0 bottom-0 flex h-16 py-8 w-full items-center text-xl md:hidden z-10`}
        id="mobile-header"
      >
        <nav id="top-nav" className="grid-cols-5 grid gap-4 w-full">
          <NavLink to="/opettaja" end className={linkClass}>
            <FiHome size={iconSize} />
            <p className={linkTextClass}>Etusivu</p>
          </NavLink>
          <NavLink to="/tiedotteet/" className={linkClass}>
            <FiInbox size={iconSize} />
            <p className={linkTextClass}>Tiedotteet</p>
          </NavLink>

          <NavLink
            to="/opettaja/hallitse/"
            className={cc(
              linkClass,
              showControlPanel
                ? "rounded-b-md rounded-t-none transition-colors duration-150"
                : " bg-bgPrimary"
            )}
            onClick={(e) => {
              e.preventDefault();
              setShowControlPanel(!showControlPanel);
              setShowMenu(false);
            }}
          >
            <FiGrid size={iconSize} />
            <p className={linkTextClass}>Hallinta</p>
          </NavLink>

          <NavLink to="/opettaja/hyvaksy/" className={linkClass}>
            <FiUserCheck size={iconSize} />
            <p className={linkTextClass}>Verifoi</p>
          </NavLink>

          <button
            className={
              linkClass +
              `${showMenu ? " bg-primaryColor rounded-b-md rounded-t-none transition-colors duration-200" : " bg-bgPrimary"}`
            }
            onClick={() => {
              setShowMenu(!showMenu);
              setShowControlPanel(false);
            }}
          >
            <FiMenu size={iconSize} />
            <p className={linkTextClass}>Menu</p>
          </button>
        </nav>

        {/* Div for Control Panel menu*/}
        <div className="absolute bottom-0 flex justify-center w-full">
          {showControlPanel && (
            <div className=" bg-bgPrimary border-b border-borderPrimary rounded-t-md w-full shadow-upper-shadow absolute grid grid-cols-5 place-items-center bottom-[64px] right-0 l animate-menu-appear-middle">
              <NavLink
                to="/opettaja/hallitse/"
                className={linkClass}
                end
                onClick={() => showControlPanel(false)}
              >
                <MdOutlineSportsFootball size={iconSize} />
                <p className={linkTextClass}>Lajit</p>
              </NavLink>
              <NavLink
                to="/opettaja/hallitse/ryhmat"
                className={linkClass}
                onClick={() => showControlPanel(false)}
              >
                <MdOutlineGroups size={iconSize} />
                <p className={linkTextClass}>Ryhmät</p>
              </NavLink>
              <NavLink
                to="/opettaja/hallitse/toimipaikat"
                className={linkClass}
                onClick={() => showControlPanel(false)}
              >
                <PiBuildings size={iconSize} />
                <p className={linkTextClass}>Toimipaikat</p>
              </NavLink>
              <NavLink
                to="/opettaja/hallitse/vierailijat"
                className={linkClass}
                onClick={() => showControlPanel(false)}
              >
                <GrUserNew size={iconSize} />
                <p className={linkTextClass}>Vierailijat</p>
              </NavLink>
              <NavLink
                to="/opettaja/hallitse/opiskelijat"
                className={linkClass}
                onClick={() => showControlPanel(false)}
              >
                <PiStudent size={iconSize} />
                <p className={linkTextClass}>Opiskelijat</p>
              </NavLink>
            </div>
          )}
        </div>

        {/* Div for Menu */}
        <div className="absolute bottom-0 flex justify-center w-full">
          {showMenu && (
            <div
              className=" bg-bgPrimary rounded-t-md w-full shadow-upper-shadow
             absolute grid grid-cols-3 place-items-center bottom-[64px] right-0
              animate-menu-appear-right border-b border-borderPrimary"
            >
              <NavLink to="/profiili" className={linkClass}>
                <FiUser size={iconSize} />
                <p className={linkTextClass}>Profiili</p>
              </NavLink>
              <button
                className={linkClass}
                onClick={() => {
                  logout();
                }}
              >
                <FiLogOut size={iconSize} />
                <p className={linkTextClass}>Kirjaudu ulos</p>
              </button>
              <div className={linkClass}>
                <ThemeSwitcher />
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="flex w-full  md:mt-20">
        <main className=" w-full mx-auto max-w-[1480px] pb-16 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default TeacherLayout;

import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiLogOut } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FiSettings } from "react-icons/fi";
import UnreadNewsIndicator from "../components/UnreadNewsIndicator";

import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

import ThemeSwitcher from "../components/themeSwitcher";

const StudentLayout = () => {
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const linkClass =
    "flex flex-col items-center text-textPrimary py-2 rounded-md text-xl hover:underline decoration-headerPrimary ";
  const linkTextClass =
    "text-textPrimary items-center text-[12px] leading-none mt-2";
  return (
    <div className="text-textPrimary">
      <header
        className={`bg-bgkPrimary border-graphPrimary fixed-header max-h-20 mb-12 hidden  
    border-b-2 px-4 py-2 text-xl shadow-md lg:flex`}
      >
        <nav id="top-nav" className="flex justify-center gap-8 ">
          <div className="text-textPrimary flex justify-center gap-8">
            <p className="items-center flex">Urheilupäiväkirja</p>
            <NavLink to="/" id="etusivuBtn" className={linkClass}>
              Etusivu
            </NavLink>
            <NavLink to="/tiedotteet/" id="tiedotteetBtn" className={linkClass}>
              Tiedotteet
            </NavLink>
            <UnreadNewsIndicator />
          </div>
        </nav>

        <div className="flex items-center gap-8">
          <NavLink to="/merkinnat/uusi" id="newJournalBtn">
            <button className="bg-graphPrimary text-textPrimary hover:text-white hover:bg-headerSecondary  text-lg rounded-md px-3 py-2 drop-shadow-lg ">
              + Uusi Merkintä
            </button>
          </NavLink>
          <div>
            <ThemeSwitcher />
          </div>

          {/* Profile button */}
          <Menu as="div" className="relative text-textPrimary">
            <Menu.Button
              className={
                "flex flex-col items-center text-textPrimary py-2 gap-2 rounded-md  text-xl"
              }
              id="userMenuBtn"
            >
              <FiUser />
              <p className="text-[12px] px-2 leading-none select-none">
                Käyttäjä
              </p>
            </Menu.Button>
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
                        id="profileBtn"
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
                        id="settingsBtn"
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
                        id="logoutBtn"
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
        className={`bg-bgkPrimary shadow-upper-shadow fixed left-0  bottom-0 flex h-16 py-8 w-full items-center text-xl lg:hidden`}
        id="mobile-header"
      >
        <nav id="top-nav" className="grid-cols-mHeader gap-4 grid w-full">
          {/* left of navigation bar */}
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

          {/* new journal entry button */}
          <div className="flex justify-center">
            <NavLink
              to="/merkinnat/uusi"
              className="absolute bottom-6 flex justify z-10"
            >
              <button
                className="bg-bgkSecondary border-headerPrimary text-headerPrimary
       shadow-upper-shadow size-16 rounded-full border-t-2
        text-3xl drop-shadow-xl duration-100 active:scale-110"
              >
                +
              </button>
            </NavLink>
          </div>

          {/* right of navigation bar */}
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
      <div className="flex w-full  lg:mt-24 box-content">
        <main className="flex w-full mx-auto max-w-[1480px] pb-16 ">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;

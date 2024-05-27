import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { FiLogOut } from "react-icons/fi";
import { FiUser } from "react-icons/fi";
import { FiHome } from "react-icons/fi";
import { FiMessageSquare } from "react-icons/fi";
import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FiSettings } from "react-icons/fi";
import UnreadNewsIndicator from "../components/UnreadNewsIndicator";
import { useJournalModal } from "../hooks/useJournalModal";

import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

import { FiInbox } from "react-icons/fi";

import ThemeSwitcher from "../components/themeSwitcher";

const StudentLayout = () => {
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { openBigModal } = useJournalModal();

  const linkClass =
    "flex flex-col items-center text-textPrimary py-2 rounded-md text-xl hover:underline decoration-primaryColor ";
  const linkTextClass =
    "text-textPrimary items-center text-[12px] leading-none mt-2";
  return (
    <div className="text-textPrimary">
      <header
        className="fixed-header bg-bgSecondary border border-borderPrimary hidden  
    border-b-2 px-4 py-2 lg:flex z-10"
      >
          <Link to={"/"} className="text-xl">
            Urheilupäiväkirja
          </Link>

          <div className="flex items-center gap-2">
            <div>
              <ThemeSwitcher />
            </div>

            <NavLink
              to="/tiedotteet/"
              id="tiedotteetBtn"
              className="flex flex-col items-center
            gap-1 p-2 rounded-md
            select-none 
            hover:cursor-pointer hover:bg-bgGray"
            >
              <FiInbox size={24} />

              <p className="text-[12px] leading-none">Tiedotteet</p>
              <UnreadNewsIndicator type="desktop" />
            </NavLink>

            {/* Profile button */}
            <Menu as="div" className="relative text-textPrimary">
              <Menu.Button
                className="flex flex-col items-center
                          gap-1 p-2 rounded-md
                          select-none 
                          hover:cursor-pointer hover:bg-bgGray"
                id="userMenuBtn"
              >
                <FiUser size={24} />
                <p className="text-[12px] leading-none select-none">Käyttäjä</p>
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
                <Menu.Items className="absolute right-0 w-36 mt-1 origin-top-right bg-bgSecondary text-lg divide-y divide-secondaryColor rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="px-1 py-1 ">
                    <Menu.Item>
                      {({ active }) => (
                        <NavLink
                          to="/profiili"
                          id="profileBtn"
                          className={`${
                            active
                              ? "bg-primaryColor text-bgSecondary"
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
                              ? "bg-primaryColor text-bgSecondary"
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
                              ? "bg-primaryColor text-bgSecondary"
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
        className={`bg-bgPrimary shadow-upper-shadow fixed left-0  bottom-0 flex 
        h-16 py-8 w-full items-center text-xl lg:hidden z-10`}
        id="mobile-header"
      >
        <nav id="top-nav" className="grid-cols-mHeader gap-4 grid w-full">
          {/* left of navigation bar */}
          <div className="grid grid-cols-2">
            <NavLink to="/" end className={linkClass}>
              <FiHome />
              <p className={linkTextClass}>Etusivu</p>
            </NavLink>

            <NavLink to="/tiedotteet/" className={linkClass}>
              <div className="relative">
                <FiMessageSquare />
                <UnreadNewsIndicator type="phone" />
              </div>
              <p className={linkTextClass}>Viestit</p>
            </NavLink>
          </div>

          {/* new journal entry button */}
          <div className="flex justify-center">
            <NavLink className="absolute bottom-6 flex justify z-20">
              <button
                className="bg-bgSecondary border-primaryColor text-primaryColor
       shadow-upper-shadow size-16 rounded-full border-t-2
        text-3xl drop-shadow-xl duration-100 active:scale-110"
                onClick={() => openBigModal("new")}
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
                `${showUserMenu ? " bg-primaryColor rounded-b-md rounded-t-none transition-colors duration-200" : " bg-bgPrimary"}`
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
              className=" bg-primaryColor rounded-t-md w-full shadow-upper-shadow absolute
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
        <main className="flex w-full mx-auto max-w-[1480px] pb-16 lg:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;

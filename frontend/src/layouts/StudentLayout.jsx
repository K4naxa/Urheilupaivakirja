import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

import { FiUser, FiHome, FiLogOut } from "react-icons/fi";
import { FiPlus } from "react-icons/fi";

import { NavLink } from "react-router-dom";
import { useState } from "react";
import { FiInbox } from "react-icons/fi";

import UnreadNewsIndicator from "../components/UnreadNewsIndicator";
import { useBigModal } from "../hooks/useBigModal";

import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

import ThemeSwitcher from "../components/themeSwitcher";

import siteLogo from "/pwa-192x192.png";
import cc from "../utils/cc";

const StudentLayout = () => {
  const { logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { openBigModal } = useBigModal();

  const checkVerticalScrollbar = (element) => {
    // Determine if a vertical scrollbar is visible
    const hasVerticalScrollbar = element.offsetWidth > element.clientWidth;

    // Calculate the width of the vertical scrollbar
    const scrollbarWidth = hasVerticalScrollbar ? element.offsetWidth - element.clientWidth : 0;

    return {
        hasVerticalScrollbar,
        scrollbarWidth
    };
}

  const linkClass =
    "flex border-t-2 border-bgPrimary flex-col items-center text-textPrimary py-2 text-xl active:text-primaryColor";
  const linkTextClass = "items-center text-[12px] leading-none mt-2 ";
  return (
    <div className="text-textPrimary">
      <div className="bg-bgSecondary border border-b-2 border-borderPrimary fixed-header">
      <header className="z-10 hidden px-4 py-2 md:flex max-w-[1600px] m-auto justify-between" >
        <Link to={"/"} className="flex items-center gap-2 text-xl">
          <img src={siteLogo} alt="site logo" className="w-8 h-8" />
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
            hover:cursor-pointer hover:bg-bgGray
            relative"
          >
            <FiInbox size={24} />

            <p className="text-[12px] leading-none">Tiedotteet</p>
            <UnreadNewsIndicator type="desktop" />
          </NavLink>

          {/* Profile button */}
          <Menu as="div" className="relative text-textPrimary">
            <Menu.Button
              className="flex flex-col items-center gap-1 p-2 rounded-md select-none hover:cursor-pointer hover:bg-bgGray"
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
              <Menu.Items className="absolute right-0 mt-1 text-lg origin-top-right divide-y rounded-md shadow-lg w-36 bg-bgSecondary divide-secondaryColor ring-1 ring-black ring-opacity-5 focus:outline-none">
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
                        <FiUser size={20} />
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
                        id="logoutBtn"
                        className={`${
                          active
                            ? "bg-primaryColor text-bgSecondary"
                            : "text-textPrimary"
                        } group flex rounded-md items-center gap-2 w-full px-2 py-2`}
                      >
                        <FiLogOut size={20} />
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
      </div>
      {/* header for mobile */}

      <header
        className={`bg-bgPrimary shadow-upper-shadow fixed left-0 px-2 bottom-0 flex 
        h-16 py-8 w-full items-center text-xl md:hidden z-10`}
        id="mobile-header"
      >
        <nav id="top-nav" className="grid w-full gap-4 grid-cols-mHeader">
          {/* left of navigation bar */}
          <div className="grid grid-cols-2">
            <NavLink
              to="/"
              end
              className={linkClass}
              onClick={() => setShowUserMenu(false)}
            >
              <FiHome size={20} />
              <p className={linkTextClass}>Etusivu</p>
            </NavLink>

            <NavLink
              to="/tiedotteet/"
              className={linkClass}
              onClick={() => setShowUserMenu(false)}
            >
              <div className="relative">
                <FiInbox size={20} />
                <UnreadNewsIndicator type="phone" />
              </div>
              <p className={linkTextClass}>Tiedotteet</p>
            </NavLink>
          </div>

          {/* new journal entry button */}
          <div className="flex justify-center">
            <div className="absolute z-20 flex bottom-6 justify">
              <div className="flex items-center justify-center text-white rounded-full bg-bgPrimary drop-shadow-t-md shadow-upper-shadow size-16 active:scale-110">
                <button
                  className="flex items-center justify-center text-white duration-100 rounded-full bg-primaryColor size-14 active:scale-110"
                  onClick={() => openBigModal("newJournalEntry")}
                >
                  <FiPlus size={24} />
                </button>
              </div>
            </div>
          </div>

          {/* right of navigation bar */}
          <div className="grid grid-cols-2 ">
            <NavLink
              to="/profiili"
              className={cc(
                linkClass,
                showUserMenu
                  ? "border-primaryColor rounded-b-md rounded-t-none transition-colors duration-200"
                  : " bg-bgPrimary"
              )}
              onClick={(e) => {
                e.preventDefault();
                setShowUserMenu(!showUserMenu);
              }}
            >
              <FiUser />
              <p className={linkTextClass}>Käyttäjä</p>
            </NavLink>
          </div>
        </nav>

        {/* Div for user Menu */}
        <div className="absolute bottom-0 flex justify-center w-full">
          {showUserMenu && (
            <div
              className=" bg-bgPrimary rounded-t-md w-full shadow-upper-shadow absolute
 grid grid-cols-mHeader gap-4 bottom-[64px] right-0 animate-menu-appear-right border-b border-borderPrimary"
            >
              <div className="grid grid-cols-2 place-items-center">
                <NavLink
                  to="/profiili"
                  className={linkClass}
                  onClick={() => setShowUserMenu(false)}
                >
                  <FiUser />
                  <p className={linkTextClass}>Profiili</p>
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
      <div className="box-content flex w-full md:mt-24">
        <main className="flex w-full mx-auto max-w-[1480px] pb-16 md:pb-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;

import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useMainContext } from "../../hooks/mainContext";

import ThemeSwitcher from "../../components/themeSwitcher/themeSwitcher";

const StudentLayout = () => {
  const { logout } = useAuth();
  const { theme } = useMainContext();

  const linkClass = `text-primary-${theme} px-4 py-2`;

  return (
    <>
      <header
        className={`bg-primary-${theme} flex justify-between items-center `}
      >
        <nav id="top-nav" className="w-full ">
          <Link
            to="/"
            className={`text-primary-${theme} px-4 py-2 hover:text-link-${theme}`}
          >
            Etusivu
          </Link>
          <Link to="/tiedotteet/" className={linkClass}>
            Tiedotteet
          </Link>
          <Link to="/merkinnat/uusi" className={linkClass}>
            Uusi merkintä
          </Link>
          <Link to="/merkinnat/" className={linkClass}>
            Merkinnät
          </Link>
        </nav>
        <div className="justify-end">
          <div className="profile-button" id="profileButton">
            <Link to="/profiili" className={linkClass}>
              Profiili
            </Link>
          </div>
          <div className="profile-button" id="logoutButton">
            <button
              className={linkClass}
              onClick={() => {
                logout();
              }}
            >
              Kirjaudu ulos
            </button>
          </div>
        </div>
      </header>
      <div className="filler-line"></div>
      <main>
        <Outlet />
        <div className="absolute bottom-2 right-5">
          <ThemeSwitcher />
        </div>
      </main>
    </>
  );
};

export default StudentLayout;

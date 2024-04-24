import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

import ThemeSwitcher from "../../components/themeSwitcher/themeSwitcher";

const StudentLayout = () => {
  const { logout } = useAuth();

  const linkClass = `text-textPrimary px-4 py-2 hover:text-blue-500 px-4 py-2`;

  return (
    <>
      <header className={`bg-bgkPrimary flex items-center px-4 py-2 `}>
        <nav id="top-nav" className="flex w-full gap-8 justify-center">
          <Link to="/" className={linkClass}>
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
        <div className="flex relative right-4 top-4">
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
      <div className="h-[1px] w-full bg-blue-400 "></div>
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

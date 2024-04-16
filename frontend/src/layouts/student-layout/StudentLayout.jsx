import "./studentLayout.css";
import userService from "../../services/userService";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const StudentLayout = () => {
  const { logout } = useAuth();
  return (
    <>
      <header className="container">
        <div className="header-container">
          <nav id="top-nav">
            <div className="menu-button" id="etusivuButton">
              <Link to="/">Etusivu</Link>
            </div>

            <div className="menu-button" id="tiedotteetButton">
              <Link to="/tiedotteet/">Tiedotteet</Link>
            </div>
            <div className="menu-button" id="tiedotteetButton">
              <Link to="/merkinnat/uusi">Uusi merkintä</Link>
            </div>
            <div className="menu-button" id="tiedotteetButton">
              <Link to="/merkinnat/">Merkinnät</Link>
            </div>
          </nav>
          <div className="profile-container">
            <div className="profile-button" id="profileButton">
              <Link to="/profiili">Profiili</Link>
            </div>
            <div className="profile-button" id="logoutButton">
              <button
                className="button"
                onClick={() => {
                  logout();
                }}
              >
                Kirjaudu ulos
              </button>
            </div>
          </div>
        </div>
        <div className="filler-line"></div>
      </header>
      <main>
        <Outlet />
      </main>
    </>
  );
};

export default StudentLayout;
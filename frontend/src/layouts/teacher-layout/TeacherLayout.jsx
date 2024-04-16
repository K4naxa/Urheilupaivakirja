import "./teacherLayout.css";
import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const TeacherLayout = () => {
  const { logout } = useAuth(); 
  return (
    <>
      <header className="container">
        <div className="header-container">
          <nav id="top-nav">
            <div className="menu-button" id="etusivuButton">
              <NavLink to="/opettaja/">Etusivu</NavLink>
            </div>
            <div className="menu-button" id="tiedotteetButton">
              <NavLink to="/opettaja/tiedotteet/">Tiedotteet</NavLink>
            </div>
            <div className="menu-button" id="verifoiButton">
              <NavLink to="/opettaja/hyvaksy/">Verifoi</NavLink>
            </div>
            <div className="menu-button" id="verifoiButton">
              <NavLink to="/opettaja/hallitse/">Hallitse</NavLink>
            </div>
          </nav>
          <div className="profile-container">
            <div className="profile_button" id="profileButton">
              <NavLink to="/profiili">Profiili</NavLink>
            </div>
            <div className="profile_button" id="logoutButton">
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

export default TeacherLayout;
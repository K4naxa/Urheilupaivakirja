import "./teacherHeader.css";
import userService from "../../services/userService";

import { Link } from "react-router-dom";

const TeacherHeader = () => {
  return (
    <div className="container">
      <div className="header-container">
        <div className="menu-container">
          <div className="menu-button" id="etusivuButton">
            <Link to="/">Etusivu</Link>
          </div>
          <div className="menu-button" id="lajitButton">
            <Link to="/lajit">Lajit</Link>
          </div>
          <div className="menu-button" id="vierailijatButton">
            <Link>Vierailijat</Link>
          </div>
          <div className="menu-button" id="tiedotteetButton">
            <Link>Tiedotteet</Link>
          </div>
          <div className="menu-button" id="verifoiButton">
            <Link to="/verify">Verifoi</Link>
          </div>
        </div>
        <div className="profile-container">
          <div className="profile_button" id="profileButton">
            <Link to="/profile">Profiili</Link>
          </div>
          <div className="profile_button" id="logoutButton">
            <button
              className="button"
              onClick={() => {
                userService.logout();
              }}
            >
              Kirjaudu ulos
            </button>
          </div>
        </div>
      </div>
      <div className="filler-line"></div>
    </div>
  );
};

export default TeacherHeader;
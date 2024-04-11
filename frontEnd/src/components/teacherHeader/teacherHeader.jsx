import "./teacherHeader.css";
import userService from "../../Services/userService";

import { Link } from "react-router-dom";

const TeacherHeader = () => {
  return (
    <div className="container">
      <div className="headerContainer">
        <div className="menuContainer">
          <div className="menuButton" id="etusivuButton">
            <Link to="/">Etusivu</Link>
          </div>
          <div className="menuButton" id="LajitButton">
            <Link to="/lajit">Lajit</Link>
          </div>
          <div className="menuButton" id="vierailijatButton">
            <Link>Vierailijat</Link>
          </div>
          <div className="menuButton" id="tiedotteetButton">
            <Link>Tiedotteet</Link>
          </div>
          <div className="menuButton" id="verifoiButton">
            <Link to="/verify">Verifoi</Link>
          </div>
        </div>
        <div className="profileContainer">
          <div className="profileButton" id="profileButton">
            <Link to="/profile">Profiili</Link>
          </div>
          <div className="profileButton" id="logoutButton">
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
      <div className="fillerLine"></div>
    </div>
  );
};

export default TeacherHeader;

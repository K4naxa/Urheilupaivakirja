import "./teacheHeader.css";

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
            Lajit
          </div>
          <div className="menuButton" id="vierailijatButton">
            Vierailijat
          </div>
          <div className="menuButton" id="tiedotteetButton">
            Tiedotteet
          </div>
          <div className="menuButton" id="verifoiButton">
            Verifoi
          </div>
        </div>
        <div className="profileContainer">
          <div className="profileButton" id="profileButton">
            Profiili
          </div>
          <div className="profileButton" id="logoutButton">
            Kirjaudu ulos
          </div>
        </div>
      </div>
      <div className="fillerLine"></div>
    </div>
  );
};

export default TeacherHeader;

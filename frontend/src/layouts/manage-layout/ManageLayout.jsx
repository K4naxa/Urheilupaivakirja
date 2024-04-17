import { NavLink, Outlet } from "react-router-dom";
import "./manageLayout.css";

const ManageLayout = () => {
  return (
    <>
      <div className="manage-layout-header">
        <nav id="manage-nav">
          <div className="menu-button" id="lajitButton">
            <NavLink to="/opettaja/hallitse/lajit">Lajit</NavLink>
          </div>
          <div className="menu-button" id="lajitButton">
            <NavLink to="/opettaja/hallitse/lajit-v2">Lajit v2</NavLink>
          </div>
          <div className="menu-button" id="ryhmatButton">
            <NavLink to="/opettaja/hallitse/ryhmat">Ryhmät</NavLink>
          </div>
          <div className="menu-button" id="vierailijatButton">
            <NavLink to="/opettaja/hallitse/vierailijat">Vierailijat</NavLink>
          </div>
          <div className="menu-button" id="opiskelijatButton">
            <NavLink to="/opettaja/hallitse/opiskelijat">Opiskelijat</NavLink>
          </div>
        </nav>
      </div>

      <Outlet />
    </>
  );
};

export default ManageLayout;

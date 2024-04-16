import { NavLink, Outlet } from "react-router-dom";

const ManageLayout = () => {
  return (
    <>
      <nav id="manage-nav">
        <div className="menu-button" id="lajitButton">
          <NavLink to="/opettaja/hallitse/lajit">Lajit</NavLink>
        </div>
        <div className="menu-button" id="lajitButton">
          <NavLink to="/opettaja/hallitse/lajit-v2">Lajit v2</NavLink>
        </div>
            <div className="menu-button" id="vierailijatButton">
          <NavLink to="/opettaja/hallitse/vierailijat">Vierailijat</NavLink>
        </div>
      </nav>
      <Outlet />
    </>
  );
};

export default ManageLayout;

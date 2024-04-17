import { NavLink, Outlet } from "react-router-dom";
import "./manageStudentsLayout.css";

const ManageStudentsLayout = () => {
  return (
    <>
      <div className="manage-students-header">
        {" "}
        <h1>Opiskelijoiden hallinta</h1>
        <nav id="manage-students-nav">
          <NavLink to="/opettaja/hallitse/opiskelijat/">Aktiiviset</NavLink> /
          <NavLink to="/opettaja/hallitse/opiskelijat/arkistoidut">
            Arkistoidut
          </NavLink>
        </nav>
      </div>

      <Outlet />
    </>
  );
};

export default ManageStudentsLayout;

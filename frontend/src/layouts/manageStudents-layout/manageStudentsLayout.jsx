import { NavLink, Outlet } from "react-router-dom";

const ManageStudentsLayout = () => {
  return (
    <>
      <nav id="manage-nav">
        <NavLink to="/opettaja/hallitse/opiskelijat/">Aktiiviset</NavLink> /
        <NavLink to="/opettaja/hallitse/opiskelijat/arkistoidut">
          Arkistoidut
        </NavLink>
      </nav>
      <Outlet />
    </>
  );
};

export default ManageStudentsLayout;

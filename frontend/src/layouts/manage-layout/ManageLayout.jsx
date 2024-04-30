import { NavLink, Outlet } from "react-router-dom";

const ManageLayout = () => {
  return (
    <div className="flex flex-col w-full">
      <nav
        id="manage-nav"
        className="hidden lg:grid grid-cols-5 my-12 place-items-center gap-4"
      >
        <NavLink to="/opettaja/hallitse/lajit">Lajit</NavLink>

        <NavLink to="/opettaja/hallitse/ryhmat">Ryhmät</NavLink>

        <NavLink to="/opettaja/hallitse/toimipaikat">Toimipaikat</NavLink>

        <NavLink to="/opettaja/hallitse/vierailijat">Vierailijat</NavLink>

        <NavLink to="/opettaja/hallitse/opiskelijat">Opiskelijat</NavLink>
      </nav>

      <Outlet />
    </div>
  );
};

export default ManageLayout;

import { NavLink, Outlet } from "react-router-dom";

const ManageLayout = () => {
  const linkClass =
    "w-32 py-4 text-lg text-center border rounded-md border-borderPrimary";
  return (
    <div className="flex flex-col w-full">
      <nav
        id="manage-nav"
        className="hidden lg:grid grid-cols-5 my-12 place-items-center max-w-[670px] gap-2 self-center"
      >
        <NavLink to="/opettaja/hallitse/lajit" className={linkClass}>
          Lajit
        </NavLink>

        <NavLink to="/opettaja/hallitse/ryhmat" className={linkClass}>
          Ryhmät
        </NavLink>

        <NavLink to="/opettaja/hallitse/toimipaikat" className={linkClass}>
          Toimipaikat
        </NavLink>

        <NavLink to="/opettaja/hallitse/vierailijat" className={linkClass}>
          Vierailijat
        </NavLink>

        <NavLink to="/opettaja/hallitse/opiskelijat" className={linkClass}>
          Opiskelijat
        </NavLink>
      </nav>

      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default ManageLayout;

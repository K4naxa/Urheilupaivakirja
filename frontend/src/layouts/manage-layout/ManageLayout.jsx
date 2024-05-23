import { NavLink, Outlet } from "react-router-dom";

const ManageLayout = () => {
  const linkClass =
    "w-32 py-4 text-lg text-center border rounded-md border-borderPrimary bg-bgSecondary hover:bg-bgPrimary hover:text-textPrimary active:text-bgSecondary ";
  return (
    <div
      className="flex flex-col bg-bgSecondary mx-auto
     md:mt-8 gap-8 md:p-8 rounded-md max-w-[850px]"
    >
      <nav
        id="manage-nav"
        className="hidden md:grid grid-cols-5 place-items-center gap-4 self-center"
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

      <Outlet />
    </div>
  );
};

export default ManageLayout;

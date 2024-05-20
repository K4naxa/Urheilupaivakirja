import { NavLink, Outlet } from "react-router-dom";

const ManageLayout = () => {
  const linkClass =
    "w-32 py-4 text-lg text-center border rounded-md border-borderPrimary bg-bgSecondary hover:bg-bgPrimary hover:text-textPrimary active:bg-graphPrimary active:text-bgSecondary ";
  return (
    <div className="flex flex-col w-full">
      <nav
        id="manage-nav"
        className="hidden lg:grid grid-cols-5 mt-8 pb-8 place-items-center gap-4 self-center
         border-b border-headerPrimary"
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

      <div className="flex w-full">
        <div className="flex w-full mx-auto max-w-[720px] pb-16 ">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ManageLayout;

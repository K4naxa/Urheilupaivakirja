import { NavLink, Outlet } from "react-router-dom";

const ManageStaffLayout = () => {
  return (
    <div className="flex flex-col gap-4 w-full rounded-md md:p-4">
      <div
        className="md:hidden text-2xl text-center py-4 bg-primaryColor w-full
        shadow-md"
      >
        Henkilökunta
      </div>
      <div className="pt-3 flex flex-col w-full items-center">
        <nav
          id="manage-students-nav"
          className="flex text-textPrimary active:text-textPrimary"
        >
          <NavLink
            to="/opettaja/hallitse/henkilokunta"
            className="pt-2 border border-borderPrimary rounded-l-md  p-2 px-4"
            end
          >
            Vierailijat
          </NavLink>{" "}
          <NavLink
            end
            to="/opettaja/hallitse/henkilokunta/opettajat/"
            className="pt-2 border border-borderPrimary rounded-r-md  p-2 px-4"
          >
            Opettajat
          </NavLink>
        </nav>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default ManageStaffLayout;

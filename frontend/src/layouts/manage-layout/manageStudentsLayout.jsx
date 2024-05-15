import { NavLink, Outlet } from "react-router-dom";

const ManageStudentsLayout = () => {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="pt-3 flex flex-col w-full items-center">
        <nav
          id="manage-students-nav"
          className="flex gap-4 text-textSecondary active:text-textPrimary"
        >
          <NavLink
            to="/opettaja/hallitse/opiskelijat/"
            className="pt-2 border border-borderPrimary rounded-md  p-2 px-4"
          >
            Aktiiviset
          </NavLink>{" "}
          <NavLink
            to="/opettaja/hallitse/opiskelijat/arkistoidut"
            className="pt-2 border border-borderPrimary rounded-md  p-2 px-4"
          >
            Arkistoidut
          </NavLink>
        </nav>
      </div>

      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default ManageStudentsLayout;

import { NavLink, Outlet } from "react-router-dom";

const ManageStudentsLayout = () => {
  return (
    <div className="flex flex-col gap-4 w-full rounded-md md:p-4">
      <div
        className="md:hidden text-2xl text-center py-4 bg-primaryColor w-full
        shadow-md"
      >
        Opiskelijat
      </div>
      <div className="pt-3 flex flex-col w-full items-center">
        <nav
          id="manage-students-nav"
          className="flex text-textPrimary active:text-textPrimary"
        >
          <NavLink
            to="/opettaja/hallitse/opiskelijat/"
            className="pt-2 border border-borderPrimary rounded-l-md  p-2 px-4"
            end
          >
            Aktiiviset
          </NavLink>{" "}
          <NavLink
            end
            to="/opettaja/hallitse/opiskelijat/arkistoidut/"
            className="pt-2 border border-borderPrimary rounded-r-md  p-2 px-4"
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

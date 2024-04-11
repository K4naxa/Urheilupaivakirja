import TeacherHeader from "../../components/teacherHeader/teacherHeader";
import userService from "../../Services/userService";
import { useContext, useEffect, useState } from "react";
import { MainContext } from "../../mainContext";

const createUserContainer = (user, setUsers) => {
  const handleVerify = () => {
    userService.verifyUser(user).then(() => {
      setUsers((prevUsers) =>
        prevUsers.filter((prevUser) => prevUser.id !== user.id)
      );
    });
  };

  return (
    <div key={user.id} className="userContainer">
      <div>{user.email}</div>
      <button onClick={() => handleVerify()}>Verify</button>
    </div>
  );
};

const Verify = () => {
  const { token } = useContext(MainContext);
  const [unverifiedUsers, setUnverifiedUsers] = useState([]);

  useEffect(() => {
    userService.getUnverifiedUsers().then((users) => {
      setUnverifiedUsers(users);
    });
  }, [token]);

  return (
    <div>
      <TeacherHeader />
      <h1>Verify</h1>
      <div className="unverifiedUserListContainer">
        {unverifiedUsers.map((user) =>
          createUserContainer(user, setUnverifiedUsers)
        )}
      </div>
    </div>
  );
};

export default Verify;
// Path: frontEnd/src/pages/Verify/Verify.jsx

import TeacherHeader from "../../layouts/teacher-header/TeacherHeader";
import userService from "../../services/userService";
import { useContext, useEffect, useState } from "react";
import { mainContext } from "../../context/mainContext";

const createUserContainer = (user, setUsers) => {
  const handleVerify = () => {
    userService.verifyUser(user).then(() => {
      setUsers((prevUsers) =>
        prevUsers.filter((prevUser) => prevUser.id !== user.id)
      );
    });
  };
  const handleDelete = () => {
    userService.deleteUser(user.id).then(() => {
      setUsers((prevUsers) =>
        prevUsers.filter((prevUser) => prevUser.id !== user.id)
      );
    });
  };

  return (
    <div key={user.id} className="userContainer">
      <div>{user.email}</div>
      <button onClick={() => handleVerify()}>Verify</button>
      <button onClick={() => handleDelete()}>Delete</button>
    </div>
  );
};

const Verify = () => {
  const { token } = useContext(mainContext);
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

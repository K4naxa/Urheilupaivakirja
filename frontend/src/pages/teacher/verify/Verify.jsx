import userService from "../../../services/userService";
import { FiTrash2, FiCheck } from "react-icons/fi";
import { useEffect, useState } from "react";

const Verify = () => {
  const [unverifiedStudents, setUnverifiedStudents] = useState([]);

  useEffect(() => {
    userService.getAllUnverified().then((users) => {
      console.log(users);
      setUnverifiedStudents(users?.students);
    });
  }, []);

  return (
    <div className="flex w-full justify-center flex-wrap mt-8 ">
      {/* Student container */}
      <div
        className="flex flex-col bg-bgSecondary rounded-md border border-borderPrimary
      min-w-96 "
      >
        <div
          className="w-full py-2 rounded-t-md 
         text-xl text-center"
        >
          <h2>Oppilaat</h2>
        </div>
        <div className=" w-full py-2 rounded-b-md border border-borderPrimary">
          <div className=" flex flex-wrap gap-4 p-2 bg-bgSecondary">
            {unverifiedStudents.map((student) => (
              <CreateStudentContainer
                key={student.user_id}
                student={student}
                setUnverifiedStudents={setUnverifiedStudents}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function CreateStudentContainer({ student, setUnverifiedStudents }) {
  const handleVerify = () => {
    console.log(student.user_id);
    userService.verifyUser(student.user_id).then(() => {
      setUnverifiedStudents((prevStudents) =>
        prevStudents.filter((prevStudents) => prevStudents.id !== student.id)
      );
    });
  };
  const handleDelete = () => {
    userService.deleteUser(student.user_id).then(() => {
      setUnverifiedStudents((prevStudents) =>
        prevStudents.filter((prevStudents) => prevStudents.id !== student.id)
      );
    });
  };

  return (
    <div
      key={student.id}
      className="flex flex-col hover:bg-bgGray p-4 rounded-md gap-2
      border border-borderPrimary"
    >
      {/* User Info */}
      <div className="text-center text-xl">
        {student.first_name} {student.last_name}
      </div>
      <div className="flex gap-1">
        <p className="text-textSecondary w-20">S-posti:</p>{" "}
        <p>{student.email}</p>
      </div>
      <div className="flex gap-1">
        <p className="text-textSecondary w-20">Laji:</p> <p>{student.sport}</p>
      </div>

      <div className="flex gap-1">
        <p className="text-textSecondary w-20">Ryhmä:</p> <p>{student.group}</p>
      </div>
      <div className="flex gap-1">
        <p className="text-textSecondary w-20">Toimipiste:</p>{" "}
        <p>{student.campus}</p>
      </div>

      {/* Control Buttons */}
      <div className="flex gap-4 justify-center">
        {" "}
        <button
          className="text-iconGreen p-1 rounded-md "
          onClick={() => handleVerify()}
        >
          <FiCheck size={20} />
        </button>
        <button
          className="text-iconRed p-1  rounded-md"
          onClick={() => handleDelete()}
        >
          <FiTrash2 size={20} />
        </button>
      </div>
    </div>
  );
}

export default Verify;
// Path: frontend/src/pages/verify/Verify.jsx

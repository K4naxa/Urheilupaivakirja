import userService from "../../../services/userService";
import { FiTrash2, FiCheck } from "react-icons/fi";
import { useEffect, useState } from "react";
import { QueryClient } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

const Verify = () => {
  const [unverifiedStudents, setUnverifiedStudents] = useState([]);
  const [unverifiedCampuses, setUnverifiedCampuses] = useState([]);
  const [unverifiedSports, setUnverifiedSports] = useState([]);

  useEffect(() => {
    userService.getAllUnverified().then((users) => {
      setUnverifiedStudents(users?.students);
    });
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Student container */}
      <div
        className="md:col-span-2 flex flex-col bg-bgSecondary rounded-md border border-borderPrimary
  min-w-96"
      >
        <div
          className="w-full py-2  rounded-t-md border-b border-borderPrimary 
     text-xl text-center"
        >
          <h2>Oppilaat</h2>
        </div>
        <div className=" w-full py-2">
          <div className=" flex justify-center lg:justify-start flex-wrap gap-4 p-2 max-h-[600px] overflow-auto">
            {unverifiedStudents.length === 0 ? (
              <div className="text-center w-full text-textSecondary">
                Ei hyväksyttäviä oppilaita
              </div>
            ) : (
              unverifiedStudents.map((student) => (
                <CreateStudentContainer
                  key={student.user_id}
                  student={student}
                  setUnverifiedStudents={setUnverifiedStudents}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Campus container */}

      <div
        className="flex flex-col bg-bgSecondary rounded-md border border-borderPrimary
  min-w-96"
      >
        <div
          className="w-full r py-2 rounded-t-md border-b border-borderPrimary 
     text-xl text-center"
        >
          <h2>Toimipisteet</h2>
        </div>
        <div className=" w-full py-2">
          <div className=" flex flex-col gap-4 p-2 bg-bgSecondary">
            {unverifiedCampuses.length === 0 ? (
              <div className="text-center text-textSecondary">
                Ei hyväksyttäviä toimipisteitä
              </div>
            ) : (
              unverifiedCampuses.map((campus) => (
                <CreateStudentContainer
                  key={campus.id}
                  campus={campus}
                  setUnverifiedCampuses={setUnverifiedCampuses}
                />
              ))
            )}
          </div>
        </div>
      </div>

      {/* Sport container */}
      <div
        className="flex flex-col bg-bgSecondary rounded-md border border-borderPrimary
  min-w-96"
      >
        <div
          className="w-full py-2 rounded-t-md border-b border-borderPrimary 
     text-xl text-center"
        >
          <h2>Lajit</h2>
        </div>
        <div className=" w-full py-2">
          <div className=" flex flex-col gap-4 p-2 bg-bgSecondary">
            {unverifiedSports.length === 0 ? (
              <div className="text-center text-textSecondary">
                Ei hyväksyttäviä lajeja
              </div>
            ) : (
              unverifiedSports.map((sport) => (
                <CreateStudentContainer
                  key={sport.id}
                  sport={sport}
                  setUnverifiedSports={setUnverifiedSports}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

function CreateStudentContainer({ student, setUnverifiedStudents }) {
  const queryClient = useQueryClient();

  const handleVerify = () => {
    userService.verifyUser(student.user_id).then(() => {
      setUnverifiedStudents((prevStudents) =>
        prevStudents.filter(
          (prevStudents) => prevStudents.user_id !== student.user_id
        )
      );
      queryClient.invalidateQueries({
        queryKey: ["studentsAndJournals"],
      });
    });
  };
  const handleDelete = () => {
    userService.deleteUser(student.user_id).then(() => {
      setUnverifiedStudents((prevStudents) =>
        prevStudents.filter(
          (prevStudents) => prevStudents.user_id !== student.user_id
        )
      );
    });
  };

  return (
    <div
      key={student.id}
      className="flex flex-col hover:bg-hoverDefault p-4 rounded-md gap-2
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
          className="text-iconGreen hover:scale-110  p-1 rounded-md "
          onClick={() => handleVerify()}
        >
          <FiCheck size={20} />
        </button>
        <button
          className="text-iconRed p-1 hover:scale-110 rounded-md"
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

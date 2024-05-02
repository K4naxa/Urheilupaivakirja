import { useState, useEffect } from "react";
import userService from "../../../../services/userService";

const createStudentContainer = (student, students, setStudents) => {
  const handleDelete = async () => {
    await userService.deleteUser(student.user_id);
    const newStudents = students.filter((s) => s.user_id !== student.user_id);
    setStudents(newStudents);
  };

  const handleArchive = async () => {
    console.log(student.id);
    await userService.toggleStudentArchive(student.id);
    const newStudents = students.filter((s) => s.user_id !== student.user_id);
    setStudents(newStudents);
  };

  return (
    <div className="manage-student-cell" key={student.id}>
      <div className="student-info-name">
        {student.first_name} {student.last_name}
      </div>
      <div className="student-info-email">{student.email}</div>
      <div className="student-info-sport">{student.sport}</div>
      <div className="student-info-group">{student.group}</div>
      <div className="student-info-campus">{student.campus}</div>
      <div className="student-info-buttons">
        <button onClick={handleDelete}>Poista</button>
        <button onClick={handleArchive}>Aktivoi</button>
      </div>
    </div>
  );
};

const ManageArchivedStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getArchivedStudents().then((data) => {
      setStudents(data);
      setLoading(false);
    });
  }, []);

  return (
    <div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="manage-student-container">
          {students.length > 0 ? (
            students.map((student) =>
              createStudentContainer(student, students, setStudents)
            )
          ) : (
            <p>No students found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ManageArchivedStudentsPage;

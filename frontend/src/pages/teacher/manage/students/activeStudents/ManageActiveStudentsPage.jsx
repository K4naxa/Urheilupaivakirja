import { useState, useEffect } from "react";
import userService from "../../../../../services/userService";
import "./ManageStudentsPage.css";

const createStudentContainer = (student, students, setStudents) => {
  const handleDelete = async () => {
    await userService.deleteUser(student.user_id);
    const newStudents = students.filter((s) => s.user_id !== student.user_id);
    setStudents(newStudents);
  };

  const handleArchive = async () => {
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
        <button onClick={handleDelete}>Delete</button>
        <button onClick={handleArchive}>Archive</button>
      </div>
    </div>
  );
};

const ManageActiveStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getStudents().then((data) => {
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

export default ManageActiveStudentsPage;

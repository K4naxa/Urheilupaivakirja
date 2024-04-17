import { useState, useEffect } from "react";
import userService from "../../../../services/userService";
import "./manageStudentsPage.css";

const createStudentContainer = (student, setStudents) => {
  const handleDelete = async () => {
    await userService.deleteUser(student.id);
    const newStudents = students.filter((s) => s.id !== student.id);
    setStudents(newStudents);
  };

  return (
    <div className="manage-student-cell" key={student.id}>
      <div className="manage-student-cell-info">
        <div className="student-info-name">
          {student.first_name} {student.last_name}
        </div>
        <div className="student-info-email">{student.email}</div>
        <div className="student-info-sport">{student.sport}</div>
        <div className="student-info-group">{student.group}</div>
        <div className="student-info-campus">{student.campus}</div>
      </div>
    </div>
  );
};

const ManageStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService.getStudents().then((data) => {
      setStudents(data);
      setLoading(false);
      console.log(data);
    });
  }, []);

  return (
    <div>
      <h1>Manage Students</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="manage-student-container">
          {students.map((student) =>
            createStudentContainer(student, setStudents)
          )}
        </div>
      )}
    </div>
  );
};

export default ManageStudentsPage;

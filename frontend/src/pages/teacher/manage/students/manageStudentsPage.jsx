import { useState, useEffect } from "react";
import userService from "../../../../services/userService";

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
        <ul>
          {students.map((student) => (
            <li key={student.id}>
              {student.first_name} {student.last_name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ManageStudentsPage;

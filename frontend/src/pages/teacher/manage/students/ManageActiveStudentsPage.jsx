import { useState, useEffect } from "react";
import userService from "../../../../services/userService";
import LoadingScreen from "../../../../components/LoadingScreen.jsx";
import StudentsComboBox from "../../../../components/ComboBoxes/StudentsComboBox.jsx";
import { Link } from "react-router-dom";

import { FiArchive } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

const createStudentContainer = (student, students, setStudents) => {
  console.log(student);
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
    <div
      className="flex justify-between border border-headerPrimary p-2 rounded-md"
      key={student.id}
    >
      <div className="flex flex-col">
        <div className="flex flex-wrap gap-4 items-center">
          <Link
            to={`/opettaja/opiskelijat/${student.user_id}`}
            className="student-info-name"
          >
            <div className="text-lg">
              {student.first_name} {student.last_name}
            </div>
          </Link>
          <p className="text-textSecondary">{student.email}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="flex gap-2 text-sm">
            <p className="text-textSecondary">laji:</p>
            {student.sport}
          </div>
          <div className="flex gap-2 text-sm">
            <p className="text-textSecondary">ryhmä: </p>
            {student.group}
          </div>
          <div className="flex gap-2 text-sm">
            <p className="text-textSecondary">toimipaikka: </p>
            {student.campus}
          </div>
        </div>
      </div>

      <div className="flex flex-col justify-center items-center gap-2">
        <button className="text-btnRed" onClick={handleDelete}>
          <FiTrash2 />
        </button>
        <button className="text-btnGray" onClick={handleArchive}>
          <FiArchive />
        </button>
      </div>
    </div>
  );
};

const ManageActiveStudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [sorting, setSorting] = useState({
    name: 0,
    sport: 0,
    group: 0,
    campus: 0,
  });

  useEffect(() => {
    userService.getStudents().then((data) => {
      setStudents(data);
      setFilteredStudents(data);
      setLoading(false);
    });
  }, []);

  const handleNameSorting = () => {
    let newSorting = { ...sorting, sport: 0, group: 0, campus: 0 };
    sorting.name === 0 && (newSorting = { ...newSorting, name: 1 });
    sorting.name === 1 && (newSorting = { ...newSorting, name: -1 });
    sorting.name === -1 && (newSorting = { ...newSorting, name: 0 });
    setSorting(newSorting);
  };
  const handleSportSorting = () => {
    let newSorting = { ...sorting, name: 0, group: 0, campus: 0 };
    sorting.sport === 0 && (newSorting = { ...newSorting, sport: 1 });
    sorting.sport === 1 && (newSorting = { ...newSorting, sport: -1 });
    sorting.sport === -1 && (newSorting = { ...newSorting, sport: 0 });
    setSorting(newSorting);
  };
  const handleGroupSorting = () => {
    let newSorting = { ...sorting, sport: 0, name: 0, campus: 0 };
    sorting.group === 0 && (newSorting = { ...newSorting, group: 1 });
    sorting.group === 1 && (newSorting = { ...newSorting, group: -1 });
    sorting.group === -1 && (newSorting = { ...newSorting, group: 0 });
    setSorting(newSorting);
  };
  const handleCampusSorting = () => {
    let newSorting = { ...sorting, sport: 0, group: 0, name: 0 };
    sorting.campus === 0 && (newSorting = { ...newSorting, campus: 1 });
    sorting.campus === 1 && (newSorting = { ...newSorting, campus: -1 });
    sorting.campus === -1 && (newSorting = { ...newSorting, campus: 0 });
    setSorting(newSorting);
  };

  useEffect(() => {
    let newFiltered = [...students];

    // Check for sorting settings
    if (sorting.name === 1) {
      newFiltered.sort((a, b) => (a.name > b.name ? 1 : -1));
    } else if (sorting.name === -1) {
      newFiltered.sort((a, b) => (a.name < b.name ? 1 : -1));
    }

    if (sorting.sport === 1) {
      newFiltered.sort((a, b) => (a.sport > b.sport ? 1 : -1));
    } else if (sorting.sport === -1) {
      newFiltered.sort((a, b) => (a.sport < b.sport ? 1 : -1));
    }

    if (sorting.group === 1) {
      newFiltered.sort((a, b) => (a.group > b.group ? 1 : -1));
    } else if (sorting.group === -1) {
      newFiltered.sort((a, b) => (a.group < b.group ? 1 : -1));
    }

    if (sorting.campus === 1) {
      newFiltered.sort((a, b) => (a.campus > b.campus ? 1 : -1));
    } else if (sorting.campus === -1) {
      newFiltered.sort((a, b) => (a.campus < b.campus ? 1 : -1));
    }

    // check if student is being searched
    if (selectedStudent)
      newFiltered = newFiltered.filter(
        (student) => student.user_id === selectedStudent.id
      );
    setFilteredStudents(newFiltered);
  }, [selectedStudent, sorting, students]);

  if (loading)
    return (
      <div className="flex w-full items-center p-8">
        <LoadingScreen />
      </div>
    );
  else
    return (
      <div className="bg-bgSecondary rounded-md p-4">
        <div className="flex justify-between mb-4">
          <StudentsComboBox
            journals={students}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
          />
          <div className="flex gap-2">
            <p>Lajittele</p>
            <button
              onClick={() => {
                handleNameSorting();
              }}
            >
              Nimi
            </button>
            <button
              onClick={() => {
                handleSportSorting();
              }}
            >
              Laji
            </button>
            <button
              onClick={() => {
                handleGroupSorting();
              }}
            >
              Ryhmä
            </button>
            <button
              onClick={() => {
                handleCampusSorting();
              }}
            >
              Toimipaikka
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {students ? (
            filteredStudents.map((student) =>
              createStudentContainer(student, students, setStudents)
            )
          ) : (
            <p>No students found</p>
          )}
        </div>
      </div>
    );
};

export default ManageActiveStudentsPage;

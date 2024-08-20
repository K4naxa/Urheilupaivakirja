import { useState, useEffect } from "react";
import userService from "../../../../services/userService";
import LoadingScreen from "../../../../components/LoadingScreen.jsx";
import { Link } from "react-router-dom";

import { FiArchive } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import { useConfirmModal } from "../../../../hooks/useConfirmModal";

import StudentMultiSelect from "../../../../components/multiSelect-search/StudentMultiSelect.jsx";
import { useQueryClient } from "@tanstack/react-query";

const createStudentContainer = (student, handleArchive, handleDelete) => {
  return (
    <div
      className="flex justify-between p-2 border rounded-md border-borderPrimary"
      key={student.user_id}
    >
      <div className="flex flex-col">
        <div className="flex flex-wrap items-center gap-4">
          <Link
            to={`/opettaja/opiskelijat/${student.user_id}`}
            className="student-info-name"
          >
            <div className="text-lg">
              {student.first_name} {student.last_name}
            </div>
          </Link>
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

      <div className="flex flex-col items-center justify-center gap-2">
        <button
          className="text-iconRed"
          onClick={() => {
            handleDelete(student);
          }}
        >
          <FiTrash2 />
        </button>
        <button
          className="text-iconGray"
          onClick={() => {
            handleArchive(student);
          }}
        >
          <FiArchive />
        </button>
      </div>
    </div>
  );
};

const ManageActiveStudentsPage = () => {
  const queryClient = useQueryClient();
  const { openConfirmModal } = useConfirmModal();

  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [sorting, setSorting] = useState({
    name: 1,
    sport: 0,
    group: 0,
    campus: 0,
  });

  useEffect(() => {
    userService.getStudents().then((data) => {
      setStudents(data);
      setFilteredStudents(
        data.sort((a, b) => (a.first_name > b.first_name ? 1 : -1))
      );
      setLoading(false);
    });
  }, []);

  const handleNameSorting = (type) => {
    let newSorting = { ...sorting, sport: 0, group: 0, campus: 0, activity: 0 };
    if (type === 1) newSorting = { ...newSorting, name: 1 };
    if (type === -1) newSorting = { ...newSorting, name: -1 };
    setSorting(newSorting);
  };
  const handleSportSorting = (type) => {
    let newSorting = { ...sorting, name: 0, group: 0, campus: 0, activity: 0 };

    if (type === 1) newSorting = { ...newSorting, sport: 1 };
    if (type === -1) newSorting = { ...newSorting, sport: -1 };
    setSorting(newSorting);
  };
  const handleGroupSorting = (type) => {
    let newSorting = { ...sorting, sport: 0, name: 0, campus: 0, activity: 0 };
    if (type === 1) newSorting = { ...newSorting, group: 1 };
    if (type === -1) newSorting = { ...newSorting, group: -1 };

    setSorting(newSorting);
  };
  const handleCampusSorting = (type) => {
    let newSorting = { ...sorting, sport: 0, group: 0, name: 0, activity: 0 };
    if (type === 1) newSorting = { ...newSorting, campus: 1 };
    if (type === -1) newSorting = { ...newSorting, campus: -1 };

    setSorting(newSorting);
  };
  const handleSortingChange = (value) => {
    switch (value) {
      case "name1":
        handleNameSorting(1);
        break;
      case "name2":
        handleNameSorting(-1);
        break;
      case "sport1":
        handleSportSorting(1);
        break;
      case "sport2":
        handleSportSorting(-1);
        break;
      case "group1":
        handleGroupSorting(1);
        break;
      case "group2":
        handleGroupSorting(-1);
        break;
      case "campus1":
        handleCampusSorting(1);
        break;
      case "campus2":
        handleCampusSorting(-1);
        break;
      default:
        break;
    }
  };

  //useEffect for sorting and filtering students
  useEffect(() => {
    let newFiltered = [...students];

    // Check for sorting settings
    if (sorting.name === 1) {
      newFiltered.sort((a, b) => (a.first_name > b.first_name ? 1 : -1));
    } else if (sorting.name === -1) {
      newFiltered.sort((a, b) => (a.first_name < b.first_name ? 1 : -1));
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
    if (selectedStudents.length > 0)
      newFiltered = newFiltered.filter((student) =>
        selectedStudents.some((s) => s.value === student.user_id)
      );
    setFilteredStudents(newFiltered);
  }, [selectedStudents, sorting, students]);

  const handleArchive = (student) => {
    const handleUserConfirmation = async () => {
      await userService.toggleStudentArchive(student.user_id).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["studentsAndJournals"],
        });
      });
      const newStudents = students.filter((s) => s.user_id !== student.user_id);
      setStudents(newStudents);
    };

    const modalText = (
      <span>
        Haluatko varmasti arkistoida opiskelijan
        <br />
        <strong>
          {student.first_name} {student.last_name}
        </strong>
        ?
        <br />
        Tämä piilottaa käyttäjän, mutta ei poista tietoja.
      </span>
    );
    openConfirmModal({
      text: modalText,
      agreeButtonText: "Arkistoi",
      declineButtonText: "Peruuta",
      onAgree: handleUserConfirmation,
      closeOnOutsideClick: false,
    });
  };

  // handle Delete funtion for students
  const handleDelete = (student) => {
    const handleUserConfirmation = async () => {
      await userService.deleteUser(student.user_id).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["studentsAndJournals"],
        });
      });
      const newStudents = students.filter((s) => s.user_id !== student.user_id);
      setStudents(newStudents);
    };

    const modalText = (
      <span>
        Haluatko varmasti poistaa opiskelijan
        <br />
        <strong>
          {student.first_name} {student.last_name}?
        </strong>
        <br />
        Tämä poistaa myös kaikki opiskelijan tekemät merkinnät pysyvästi.
      </span>
    );

    openConfirmModal({
      onAgree: handleUserConfirmation,
      text: modalText,
      agreeButtonText: "Poista",
      agreeStyle: "red",
      declineButtonText: "Peruuta",
      useTimer: true,
    });
  };

  if (loading)
    return (
      <div className="flex items-center w-full p-8">
        <LoadingScreen />
      </div>
    );
  else
    return (
      <div className="p-2 rounded-md bg-bgSecondary">
        <div className="flex flex-wrap items-end justify-center gap-4 mb-4 sm:justify-between">
          <StudentMultiSelect
            studentArray={students}
            selectedStudents={selectedStudents}
            setSelectedStudents={setSelectedStudents}
          />

          <div className="flex flex-col">
            <label
              htmlFor="sorting"
              className="px-2 text-xs text-textSecondary"
            >
              Järjestys:
            </label>
            <select
              name="sorting"
              id="sortingSelect"
              className="p-1 border rounded-md bg-bgSecondary border-borderPrimary text-textSecondary hover:cursor-pointer "
              onChange={(e) => handleSortingChange(e.target.value)}
            >
              <option value="name1">Nimi A-Ö</option>
              <option value="name2">Nimi Ö-A</option>
              <option value="sport1">Laji A-Ö</option>
              <option value="sport2">Laji Ö-A</option>
              <option value="group1">Ryhmä A-Ö</option>
              <option value="group2">Ryhmä Ö-A</option>
              <option value="campus1">Toimipaikka A-Ö</option>
              <option value="campus2">Toimipaikka Ö-A</option>
            </select>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {students.length > 0 ? (
            filteredStudents.map((student) =>
              createStudentContainer(student, handleArchive, handleDelete)
            )
          ) : (
            <p className="my-2 text-center">Ei opiskelijoita</p>
          )}
        </div>
      </div>
    );
};

export default ManageActiveStudentsPage;

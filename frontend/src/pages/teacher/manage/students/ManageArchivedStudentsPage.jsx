import { useState, useEffect } from "react";
import studentService from "../../../../services/studentService";
import LoadingScreen from "../../../../components/LoadingScreen.jsx";

import { Link } from "react-router-dom";
import { useConfirmModal } from "../../../../hooks/useConfirmModal";

import { FiUserPlus } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

import StudentMultiSelect from "../../../../components/multiselect-search/StudentMultiSelect.jsx";
import { useQueryClient } from "@tanstack/react-query";

//TODO: Ryhmä not showing correctly in the UI
const createStudentContainer = (student, handleActivation, handleDelete) => {
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
            <p className="text-textSecondary">Laji:</p>
            {student.sport}
          </div>
          <div className="flex gap-2 text-sm">
            <p className="text-textSecondary">Ryhmä: </p>
            {student.name}
          </div>
          <div className="flex gap-2 text-sm">
            <p className="text-textSecondary">Toimipaikka: </p>
            {student.campus}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <button
        title="Poista opiskelija"
          className="text-iconRed hover:text-red-700"
          onClick={() => {
            handleDelete(student);
          }}
        >
          <FiTrash2 />
        </button>
        <button
        title="Aktivoi opiskelija"
          className="text-iconGray hover:text-primaryColor"
          onClick={() => {
            handleActivation(student);
          }}
        >
          <FiUserPlus />
        </button>
      </div>
    </div>
  );
};

const ManageArchivedStudentsPage = () => {
  const queryClient = useQueryClient();
  const { openConfirmModal } = useConfirmModal();
  const [sorting, setSorting] = useState({
    name: 1,
    sport: 0,
    group: 0,
    campus: 0,
  });

  const [state, setState] = useState({
    students: [],
    filteredStudents: [],
    loading: true,
    selectedStudents: [],
  });

  useEffect(() => {
    studentService.getArchivedStudents().then((data) => {
      setState({
        students: data,
        filteredStudents: data.sort((a, b) =>
          a.first_name > b.first_name ? 1 : -1
        ),
        loading: false,
      });
    });
  }, []);

  const handleActivation = (student) => {
    const handleUserConfirmation = async () => {
      await studentService.toggleStudentArchive(student.user_id).then(() => {
        queryClient.invalidateQueries({
          queryKey: ["StudentsList"],
        });
      });
      const newStudents = state.students.filter(
        (s) => s.user_id !== student.user_id
      );
      setState({ ...state, students: newStudents });
    };

    const modalText = (
      <span>
        Haluatko varmasti aktivoida opiskelijan
        <br />
        <strong>
          {student.first_name} {student.last_name}
        </strong>
        ?
      </span>
    );
    openConfirmModal({
      text: modalText,
      agreeButtonText: "Aktivoi",
      declineButtonText: "Peruuta",
      onAgree: handleUserConfirmation,
      closeOnOutsideClick: false,
    });
  };

  // handle Delete funtion for students
  const handleDelete = (student) => {
    const handleUserConfirmation = async () => {
      await studentService.deleteStudent(student.user_id);
      const newStudents = state.students.filter(
        (s) => s.user_id !== student.user_id
      );
      setState({ ...state, students: newStudents });
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
    let newFiltered = [...state.students];

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
      newFiltered.sort((a, b) => (a.name > b.name ? 1 : -1));
    } else if (sorting.group === -1) {
      newFiltered.sort((a, b) => (a.name < b.name ? 1 : -1));
    }

    if (sorting.campus === 1) {
      newFiltered.sort((a, b) => (a.campus > b.campus ? 1 : -1));
    } else if (sorting.campus === -1) {
      newFiltered.sort((a, b) => (a.campus < b.campus ? 1 : -1));
    }

    // check if student is being searched
    if (state.selectedStudents?.length > 0)
      newFiltered = newFiltered.filter((student) => {
        return state.selectedStudents.some((s) => s.value === student.user_id);
      });

    setState({ ...state, filteredStudents: newFiltered });
  }, [state.selectedStudents, sorting, state.students]);

  if (state.loading)
    return (
      <div className="flex items-center w-full p-8">
        <LoadingScreen />
      </div>
    );

  return (
    <div className="p-2 rounded-md bg-bgSecondary">
      <div className="flex flex-wrap items-end justify-center gap-4 mb-4 sm:justify-between">
        <StudentMultiSelect
          studentArray={state.students}
          state={state}
          handleViewUpdate={setState}
          filter={state.selectedStudents}
        />

        <div className="flex flex-col">
          <label htmlFor="sorting" className="px-2 text-xs text-textSecondary">
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
        {state.students.length > 0 ? (
          state.filteredStudents.map((student) =>
            createStudentContainer(student, handleActivation, handleDelete)
          )
        ) : (
          <p className="my-2 text-center">Ei arkistoituja opiskelijoita</p>
        )}
      </div>
    </div>
  );
};

export default ManageArchivedStudentsPage;

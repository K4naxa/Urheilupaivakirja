import { useState, useEffect } from "react";
import userService from "../../../../services/userService";
import LoadingScreen from "../../../../components/LoadingScreen.jsx";
import StudentsComboBox from "../../../../components/ComboBoxes/StudentsComboBox.jsx";
import { Link } from "react-router-dom";

import { FiChevronUp } from "react-icons/fi";
import { FiChevronDown } from "react-icons/fi";
import { FiArchive } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

import ConfirmModal from "../../../../components/confirm-modal/confirmModal.jsx";

import cc from "../../../../utils/cc.js";

const createStudentContainer = (student, handleArchive, handleDelete) => {
  const daysSinceLastEntry = () => {
    if (student.journal_entries.length === 0) return "Ei merkintöjä";
    const lastEntry =
      student.journal_entries[student.journal_entries.length - 1];
    const lastEntryDate = new Date(lastEntry.created_at);
    const today = new Date();
    const differenceInTime = today.getTime() - lastEntryDate.getTime();
    const differenceInDays = differenceInTime / (1000 * 3600 * 24);

    if (differenceInDays < 1) return "<24h";
    else if (differenceInDays < 2) return "<48h";
    else if (differenceInDays < 3) return "<72h";
    else if (differenceInDays < 7) return "<7vrk";
    else if (differenceInDays < 14) return "<14vrk";
    else if (differenceInDays < 30) return "<1kk";
    else if (differenceInDays < 60) return "<2kk";
    else if (differenceInDays < 90) return "<3kk";
    else if (differenceInDays < 180) return "<6kk";
    else if (differenceInDays < 365) return "<1v";
    return ">1v";
  };

  return (
    <div
      className="flex justify-between border border-headerPrimary p-2 rounded-md"
      key={student.user_id}
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
          <div className="text-textSecondary flex text-sm gap-1">
            <p>Aktiivisuus: </p>{" "}
            <p className="text-textPrimary">{daysSinceLastEntry()}</p>
          </div>
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
        <button
          className="text-btnRed"
          onClick={() => {
            handleDelete(student);
          }}
        >
          <FiTrash2 />
        </button>
        <button
          className="text-btnGray"
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
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState("");
  const [sorting, setSorting] = useState({
    name: 0,
    sport: 0,
    group: 0,
    campus: 0,
    activity: 0,
  });

  // statet Modalia varten
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [continueButton, setContinueButton] = useState("");
  const [agreeStyle, setAgreeStyle] = useState("");
  const [handleUserConfirmation, setHandleUserConfirmation] = useState(
    () => {}
  );

  useEffect(() => {
    userService.getStudents().then((data) => {
      setStudents(data);
      setFilteredStudents(data);
      setLoading(false);
    });
  }, []);

  const handleNameSorting = () => {
    let newSorting = { ...sorting, sport: 0, group: 0, campus: 0, activity: 0 };
    sorting.name === 0 && (newSorting = { ...newSorting, name: 1 });
    sorting.name === 1 && (newSorting = { ...newSorting, name: -1 });
    sorting.name === -1 && (newSorting = { ...newSorting, name: 0 });
    setSorting(newSorting);
  };
  const handleSportSorting = () => {
    let newSorting = { ...sorting, name: 0, group: 0, campus: 0, activity: 0 };
    sorting.sport === 0 && (newSorting = { ...newSorting, sport: 1 });
    sorting.sport === 1 && (newSorting = { ...newSorting, sport: -1 });
    sorting.sport === -1 && (newSorting = { ...newSorting, sport: 0 });
    setSorting(newSorting);
  };
  const handleGroupSorting = () => {
    let newSorting = { ...sorting, sport: 0, name: 0, campus: 0, activity: 0 };
    sorting.group === 0 && (newSorting = { ...newSorting, group: 1 });
    sorting.group === 1 && (newSorting = { ...newSorting, group: -1 });
    sorting.group === -1 && (newSorting = { ...newSorting, group: 0 });
    setSorting(newSorting);
  };
  const handleCampusSorting = () => {
    let newSorting = { ...sorting, sport: 0, group: 0, name: 0, activity: 0 };
    sorting.campus === 0 && (newSorting = { ...newSorting, campus: 1 });
    sorting.campus === 1 && (newSorting = { ...newSorting, campus: -1 });
    sorting.campus === -1 && (newSorting = { ...newSorting, campus: 0 });
    setSorting(newSorting);
  };

  const handleActivitySorting = () => {
    let newSorting = { ...sorting, sport: 0, group: 0, name: 0, campus: 0 };
    sorting.activity === 0 && (newSorting = { ...newSorting, activity: 1 });
    sorting.activity === 1 && (newSorting = { ...newSorting, activity: -1 });
    sorting.activity === -1 && (newSorting = { ...newSorting, activity: 0 });
    setSorting(newSorting);
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

    if (sorting.activity === 1) {
      newFiltered.sort((a, b) => {
        const dateA = new Date(
          a.journal_entries[a.journal_entries.length - 1]?.created_at || 0
        ).getTime();
        const dateB = new Date(
          b.journal_entries[b.journal_entries.length - 1]?.created_at || 0
        ).getTime();
        return dateA - dateB;
      });
    } else if (sorting.activity === -1) {
      newFiltered.sort((a, b) => {
        const dateA = new Date(
          a.journal_entries[a.journal_entries.length - 1]?.created_at || 0
        ).getTime();
        const dateB = new Date(
          b.journal_entries[b.journal_entries.length - 1]?.created_at || 0
        ).getTime();
        return dateB - dateA;
      });
    }

    // check if student is being searched
    if (selectedStudent)
      newFiltered = newFiltered.filter(
        (student) => student.user_id === selectedStudent.id
      );
    setFilteredStudents(newFiltered);
  }, [selectedStudent, sorting, students]);

  const handleArchive = (student) => {
    setAgreeStyle("gray");
    setModalMessage(
      `Haluatko varmasti arkistoida opiskelijan ${student.first_name} ${student.last_name}?`
    );
    setContinueButton("Arkistoi");

    const handleUserConfirmation = async () => {
      await userService.toggleStudentArchive(student.user_id);
      const newStudents = students.filter((s) => s.user_id !== student.user_id);
      setStudents(newStudents);
      setShowConfirmModal(false);
    };
    setHandleUserConfirmation(() => handleUserConfirmation);
    setShowConfirmModal(true);
  };

  // handle Delete funtion for students
  const handleDelete = (student) => {
    setShowConfirmModal(true);
    setAgreeStyle("red");
    setModalMessage(
      `Haluatko varmasti poistaa opiskelijan ${student.first_name} ${student.last_name}? 

      Tämä poistaa myös kaikki opiskelijan tekemät merkinnät pysyvästi.`
    );
    setContinueButton("Poista");

    const handleUserConfirmation = async () => {
      await userService.deleteUser(student.user_id);
      const newStudents = students.filter((s) => s.user_id !== student.user_id);
      setStudents(newStudents);
      setShowConfirmModal(false);
    };
    setHandleUserConfirmation(() => handleUserConfirmation);
  };

  if (loading)
    return (
      <div className="flex w-full items-center p-8">
        <LoadingScreen />
      </div>
    );
  else
    return (
      <div className="bg-bgSecondary rounded-md p-4">
        <div className="flex flex-wrap gap-4 justify-center sm:justify-between mb-4">
          <StudentsComboBox
            journals={students}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
          />
          <div className="flex gap-2 flex-wrap text-sm text-textSecondary">
            <div
              className={cc(
                "flex items-center hover:underline hover:cursor-pointer select-none",
                sorting.name !== 0 && "text-headerPrimary"
              )}
              onClick={() => {
                handleNameSorting();
              }}
            >
              Nimi{" "}
              <p className="w-6">
                {sorting.name === 1 && <FiChevronUp />}
                {sorting.name === -1 && <FiChevronDown />}
              </p>
            </div>
            <div
              className={cc(
                "flex items-center hover:underline hover:cursor-pointer select-none",
                sorting.sport !== 0 && "text-headerPrimary"
              )}
              onClick={() => {
                handleSportSorting();
              }}
            >
              Laji
              <p className="w-6">
                {sorting.sport === 1 && <FiChevronUp />}
                {sorting.sport === -1 && <FiChevronDown />}
              </p>
            </div>
            <div
              className={cc(
                "flex items-center hover:underline hover:cursor-pointer select-none",
                sorting.group !== 0 && "text-headerPrimary"
              )}
              onClick={() => {
                handleGroupSorting();
              }}
            >
              Ryhmä
              <p className="w-6">
                {sorting.group === 1 && <FiChevronUp />}
                {sorting.group === -1 && <FiChevronDown />}
              </p>
            </div>
            <div
              className={cc(
                "flex items-center hover:underline hover:cursor-pointer select-none",
                sorting.campus !== 0 && "text-headerPrimary"
              )}
              onClick={() => {
                handleCampusSorting();
              }}
            >
              Toimipaikka
              <p className="w-6">
                {sorting.campus === 1 && <FiChevronUp />}
                {sorting.campus === -1 && <FiChevronDown />}
              </p>
            </div>
            <div
              className={cc(
                "flex items-center hover:underline hover:cursor-pointer select-none",
                sorting.activity !== 0 && "text-headerPrimary"
              )}
              onClick={() => {
                handleActivitySorting();
              }}
            >
              Aktiivisuus
              <p className="w-6">
                {sorting.activity === 1 && <FiChevronUp />}
                {sorting.activity === -1 && <FiChevronDown />}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          {students ? (
            filteredStudents.map((student) =>
              createStudentContainer(student, handleArchive, handleDelete)
            )
          ) : (
            <p>No students found</p>
          )}
        </div>
        <ConfirmModal
          isOpen={showConfirmModal}
          onDecline={() => setShowConfirmModal(false)}
          onAgree={handleUserConfirmation}
          text={modalMessage}
          agreeButton={continueButton}
          declineButton={"Peruuta"}
          agreeStyle={agreeStyle}
        />
      </div>
    );
};

export default ManageActiveStudentsPage;

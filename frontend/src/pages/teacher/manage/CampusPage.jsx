import { useState, useEffect } from "react";
import campusService from "../../../services/campusService";
import { FiEdit3 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import cc from "../../../utils/cc";
import { useConfirmModal } from "../../../hooks/useConfirmModal";
import { useToast } from "../../../hooks/toast-messages/useToast";

// renders a container for a campus while checking if it is being edited
const CreateCampusContainer = ({ campus, setCampuses, campuses }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(campus.name);
  const [error, setError] = useState("");
  const { openConfirmModal } = useConfirmModal();
  const { addToast } = useToast();


  
  // sets a timeout for the error message
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 7500);
    }
  }, [error]);

  const handleEdit = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setNewName(campus.name);
      setIsEditing(false);
    }
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  const handleSave = () => {
    if (newName === "") {
      setError("Toimipaikan nimi puuttuu");
      return;
    }
    if (campuses.find((campus) => campus.name === newName)) {
      setError("Toimipaikka on jo olemassa");
      return;
    }

    const newCampus = {
      id: campus.id,
      student_count: campus.student_count,
      name: newName,
    };
    campusService.editCampus(newCampus).then(() => {
      setCampuses((prevCampuses) =>
        prevCampuses.map((prevCampus) =>
          prevCampus.id === campus.id ? newCampus : prevCampus
        )
      );
      addToast("Toimipaikan nimi vaihdettu", { style: "success" }); 
      setIsEditing(false);
    });
  };

  // NEW
  const handleDelete = () => {
    const handleUserConfirmation = () => {
      campusService
      .deleteCampus(campus.id)
      .then(() => {
        setCampuses((prevCampuses) =>
          prevCampuses.filter((prevCampus) => prevCampus.id !== campus.id)
        );
        addToast("Toimipaikka poistettu", { style: "success" }); 
      })
      .catch((error) => {
        addToast("Virhe poistettaessa toimipaikkaa", { style: "error" }); 
        setError(error.response.data.error);
      });
    };
  
    const modalText = (
      <span>
        Haluatko varmasti poistaa toimipaikan
        <br />
        <strong>
          {campus.name}?
        </strong>
        <br />
      </span>
    );
  
    openConfirmModal({
      onAgree: () => handleUserConfirmation(),
      text: modalText,
      agreeButtonText: "Poista",
      agreeStyle: "red",
      declineButtonText: "Peruuta",
      useTimer: true,
    });
  };



  if (isEditing) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center justify-between gap-4 p-2 my-2 rounded-md">
          <input
            autoFocus
            type="text"
            className="w-full p-1 border rounded-md text-textPrimary bg-bgGray border-borderPrimary focus-visible:outline-none"
            data-testid="editCampus"
            defaultValue={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave(e.target.value);
              }
            }}
          />
          <div className="flex gap-4 text-sm">
            <button
              data-testid="saveBtn"
              onClick={() => handleSave(newName)}
              className="Button text-white bg-primaryColor"
            >
              Tallenna
            </button>{" "}
            <button
              onClick={() => handleEdit()}
              data-testid="cancelBtn"
              className="Button bg-btnGray"
            >
              Peruuta
            </button>
          </div>
        </div>
        {error && <p className="px-2 text-btnRed">{error}</p>}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col">
        {/* main Container */}
        <div className="grid items-center p-2 rounded-md grid-cols-controlpanel3 hover:bg-bgGray">
          <p className="">{campus.name}</p>
          <p className="text-center">{campus.student_count}</p>
          <div className="flex gap-4">
            <button
              className="IconButton text-iconGray"
              data-testid="editBtn"
              onClick={() => handleEdit()}
            >
              <FiEdit3 size={20} />
            </button>
            <button
              className="IconButton text-iconRed "
              data-testid="deleteBtn"
              onClick={() => handleDelete()}
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>

        {/* error container */}
        {error && (
          <p className="p-2 text-center text-red-500 bg-bgSecondary">{error}</p>
        )}
      </div>
    );
  }
};

const handleInputError = (input, setError, campuses) => {
  if (input === "") return false;

  if (input.length > 20) {
    setError("Toimipaikan nimi liian pitkä");
    return false;
  }
  if (campuses.some((campus) => campus.name === input)) {
    setError("Toimipaikka on jo olemassa");
    return false;
  }

  setError("");
  return true;
};

const CampusPage = () => {
  const [campuses, setCampuses] = useState([]);
  const [sortedCampuses, setSortedCampuses] = useState([]);
  const [newCampus, setNewCampus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sorting, setSorting] = useState({
    name: 0,
    student: 0,
  });
  const { addToast } = useToast();

  useEffect(() => {
    campusService.getCampuses().then((data) => {
      setCampuses(data);
      setSortedCampuses(data);
    });
  }, []);

  const handleNewCampus = () => {
    if (!handleInputError(newCampus, setErrorMessage, campuses)) return;
    campusService.addCampus(newCampus).then(() => {
      campusService.getCampuses().then((data) => {
        addToast("Uusi toimipaikka lisätty", { style: "success" }); 
        setCampuses(data);
        setSortedCampuses(data);
        setNewCampus("");
      });
    });
  };

  useEffect(() => {
    if (sorting.name === 0 && sorting.student === 0)
      return setSortedCampuses(campuses);
    if (sorting.name) {
      if (sorting.name === 1) {
        setSortedCampuses((prevSports) =>
          [...prevSports].sort((a, b) => (a.name > b.name ? 1 : -1))
        );
      } else if (sorting.name === -1) {
        setSortedCampuses((prevSports) =>
          [...prevSports].sort((a, b) => (a.name < b.name ? 1 : -1))
        );
      }
    }

    if (sorting.student) {
      if (sorting.student === 1) {
        setSortedCampuses((prevSports) =>
          [...prevSports].sort((a, b) =>
            a.student_count > b.student_count ? 1 : -1
          )
        );
      } else if (sorting.student === -1) {
        setSortedCampuses((prevSports) =>
          [...prevSports].sort((a, b) =>
            a.student_count < b.student_count ? 1 : -1
          )
        );
      }
    }
  }, [sorting, campuses]);

  const handleNameSorting = () => {
    let newSorting = { ...sorting, student: 0 };
    sorting.name === 0 && (newSorting = { ...newSorting, name: 1 });
    sorting.name === 1 && (newSorting = { ...newSorting, name: -1 });
    sorting.name === -1 && (newSorting = { ...newSorting, name: 0 });
    setSorting(newSorting);
  };
  const handleStudentSorting = () => {
    let newSorting = { ...sorting, name: 0 };
    sorting.student === 0 && (newSorting = { ...newSorting, student: 1 });
    sorting.student === 1 && (newSorting = { ...newSorting, student: -1 });
    sorting.student === -1 && (newSorting = { ...newSorting, student: 0 });
    setSorting(newSorting);
  };

  return (
    <div className="items-center w-full rounded-md bg-bgSecondary">
      {/* header for mobile*/}
      <div className="w-full py-4 text-2xl text-center shadow-md md:hidden bg-primaryColor">
        Toimipaikat
      </div>
      {/* Error Header */}
      {errorMessage && (
        <div
          id="errorHeader"
          className="relative w-full p-2 mb-4 text-lg text-center shadow-md bg-btnRed text-textPrimary animate-menu-appear-top rounded-b-md"
        >
          <button
            onClick={() => setErrorMessage("")}
            className="absolute translate-y-1/2 right-4 bottom-1/2"
          >
            X
          </button>
          {errorMessage}
        </div>
      )}

      {/* Campus Container */}
      <div className="flex flex-col w-full gap-8 p-4 border rounded-md border-borderPrimary">
        {/* New campus input */}
        {/* New Sport input */}
        <div className="flex justify-center mt-4 ">
          <input
            className="p-1 border text-textPrimary bg-bgGray border-borderPrimary rounded-l-md focus-visible:outline-none"
            type="text"
            data-testid="newCampusInput"
            placeholder="Uusi toimipaikka"
            value={newCampus}
            onChange={(e) => setNewCampus(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleNewCampus();
              }
            }}
          />
          <button
            onClick={() => handleNewCampus()}
            className="px-4 py-2 text-white duration-75 select-none rounded-r-md bg-primaryColor hover:bg-hoverPrimary active:scale-95"
          >
            +
          </button>
        </div>
        <div className="flex flex-col gap-2" id="campusesContainer">
          <div className="grid items-center px-2 grid-cols-controlpanel3 text-textSecondary ">
            <p
              onClick={() => {
                handleNameSorting();
              }}
              className={cc(
                "select-none cursor-pointer",
                sorting.name === 1 && "text-primaryColor",
                sorting.name === -1 && "text-primaryColor"
              )}
            >
              Toimipaikka
            </p>
            <p
              onClick={() => handleStudentSorting()}
              className={cc(
                "text-center select-none cursor-pointer",
                sorting.student === 1 && "text-primaryColor",
                sorting.student === -1 && "text-primaryColor"
              )}
            >
              Opiskelijat
            </p>
            <p className="w-16" />
          </div>
          <div
            className="flex flex-col divide-y divide-borderPrimary"
            id="campusContainer"
          >
            {sortedCampuses.map((campus) => (
              <CreateCampusContainer
                campus={campus}
                campuses={sortedCampuses}
                setCampuses={setSortedCampuses}
                key={campus.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusPage;

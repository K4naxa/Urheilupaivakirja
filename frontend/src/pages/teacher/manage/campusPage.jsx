import { useState, useEffect } from "react";
import publicService from "../../../services/publicService";
import { FiEdit3 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

// renders a container for a campus while checking if it is being edited
const CreateCampusContainer = ({ campus, setCampuses, campuses }) => {
  const [newName, setNewName] = useState(campus.name);
  const [error, setError] = useState("");

  // sets a timeout for the error message
  useEffect(() => {
    if (error) {
      setTimeout(() => {
        setError("");
      }, 5000);
    }
  }, [error]);

  // checks if campus has edit value and removes it if it does, otherwise creates a edit value
  const handleEdit = () => {
    setCampuses((prevCampuses) =>
      prevCampuses.map((prevCampus) => {
        if (prevCampus.id === campus.id) {
          {
            if (campus.isEditing) {
              setNewName(campus.name);
              return {
                id: campus.id,
                student_count: campus.student_count,
                name: campus.name,
              };
            } else {
              return { ...prevCampus, isEditing: true };
            }
          }
        } else {
          return prevCampus;
        }
      })
    );
  };

  const handleSave = () => {
    if (newName === "") {
      setError("Toimipaikan nimi puuttuu");
      return;
    }
    if (campuses.some((campus) => campus.name === newName)) {
      setError("Toimipaikka on jo olemassa");
      return;
    }

    const newCampus = {
      id: campus.id,
      student_count: campus.student_count,
      name: newName,
    };
    publicService.editCampus(newCampus).then(() => {
      setCampuses((prevCampuses) =>
        prevCampuses.map((prevCampus) =>
          prevCampus.id === campus.id ? newCampus : prevCampus
        )
      );
    });
  };

  const handleDelete = () => {
    publicService
      .deleteCampus(campus.id)
      .then(() => {
        setCampuses((prevCampuses) =>
          prevCampuses.filter((prevCampus) => prevCampus.id !== campus.id)
        );
      })
      .catch((error) => {
        setError(error.response.data.error);
      });
  };

  if (campus.isEditing) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-between rounded-md p-2 my-2 gap-4 items-center">
          <input
            autoFocus
            type="text"
            className="text-textPrimary bg-bgGray p-1 w-full
            border border-borderPrimary rounded-md
              focus-visible:outline-none"
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
              className="Button bg-btnGreen"
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
        {error && <p className="text-btnRed px-2">{error}</p>}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col">
        {/* main Container */}
        <div className="grid grid-cols-controlpanel3 hover:bg-bgGray rounded-md  p-2 items-center">
          <p className="">{campus.name}</p>
          <p className="text-center">{campus.student_count}</p>
          <div className="flex gap-4 text-xl">
            <button
              className="IconButton text-iconGray"
              data-testid="editBtn"
              onClick={() => handleEdit()}
            >
              <FiEdit3 />
            </button>
            <button
              className="IconButton text-iconRed "
              data-testid="deleteBtn"
              onClick={() => handleDelete()}
            >
              <FiTrash2 />
            </button>
          </div>
        </div>

        {/* error container */}
        {error && (
          <p className="bg-bgSecondary text-red-500 text-center p-2">{error}</p>
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
  const [newCampus, setNewCampus] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    publicService.getCampuses().then((data) => setCampuses(data));
  }, []);

  const handleNewCampus = () => {
    if (!handleInputError(newCampus, setErrorMessage, campuses)) return;
    publicService.addCampus(newCampus).then(() => {
      publicService.getCampuses().then((data) => {
        setCampuses(data);
        setNewCampus("");
      });
    });
  };

  return (
    <div className="w-full items-center bg-bgSecondary rounded-md">
      {/* header for mobile*/}
      <div
        className="md:hidden text-2xl text-center py-4 bg-primaryColor w-full
       rounded-b-md shadow-md"
      >
        Toimipaikat
      </div>
      {/* Error Header */}
      {errorMessage && (
        <div
          id="errorHeader"
          className="bg-btnRed w-full text-textPrimary text-center text-lg p-2
          mb-4 animate-menu-appear-top shadow-md rounded-b-md relative"
        >
          <button
            onClick={() => setErrorMessage("")}
            className="absolute right-4 bottom-1/2 translate-y-1/2"
          >
            X
          </button>
          {errorMessage}
        </div>
      )}

      {/* Campus Container */}
      <div
        className="flex flex-col gap-10 p-4 w-full 
      border border-borderPrimary rounded-md"
      >
        {/* New campus input */}
        {/* New Sport input */}
        <div className=" flex justify-center">
          <input
            className="text-textPrimary bg-bgGray p-1 
            border border-borderPrimary rounded-l-md
              focus-visible:outline-none"
            type="text"
            data-testid="newSportInput"
            placeholder="Luo toimipaikka"
            value={newCampus}
            onChange={(e) => setNewCampus(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleNewCampus();
              }
            }}
          />
          <p
            onClick={() => handleNewCampus()}
            className="py-2 px-4 rounded-r-md bg-primaryColor text-white
             hover:bg-hoverPrimary active:scale-95 duration-75 select-none"
          >
            +
          </p>
        </div>
        <div className="flex flex-col gap-2" id="campusesContainer">
          <div className="grid grid-cols-controlpanel3 w-full text-textSecondary px-2">
            <p className="">Toimipaikka</p>
            <p className="text-center">Opiskelijat</p>
            <div className="w-16" />
          </div>
          <div className="flex flex-col divide-y divide-borderPrimary">
            {campuses.map((campus) => (
              <CreateCampusContainer
                campus={campus}
                campuses={campuses}
                setCampuses={setCampuses}
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

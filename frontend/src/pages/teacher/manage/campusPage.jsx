import { useState, useEffect } from "react";
import publicService from "../../../services/publicService";
import { FiEdit3 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

// renders a container for a campus while checking if it is being edited
const CreateCampusContainer = ({ campus, setCampuses }) => {
  const [newName, setNewName] = useState(campus.name);
  // checks if campus has edit value and removes it if it does, otherwise creates a edit value
  const handleEdit = () => {
    setCampuses((prevCampuses) =>
      prevCampuses.map((prevCampus) => {
        if (prevCampus.id === campus.id) {
          {
            if (campus.isEditing) return { id: campus.id, name: campus.name };
            else return { ...prevCampus, isEditing: true };
          }
        } else {
          return prevCampus;
        }
      })
    );
  };

  const handleSave = (newName) => {
    const newCampus = { id: campus.id, name: newName };
    publicService.editCampus(newCampus).then(() => {
      setCampuses((prevCampuses) =>
        prevCampuses.map((prevCampus) =>
          prevCampus.id === campus.id ? newCampus : prevCampus
        )
      );
    });
  };

  const handleDelete = () => {
    publicService.deleteCampus(campus.id).then(() => {
      setCampuses((prevCampuses) =>
        prevCampuses.filter((prevCampus) => prevCampus.id !== campus.id)
      );
    });
  };

  if (campus.isEditing) {
    return (
      <div className="flex flex-col">
        <div>
          <input
            autoFocus
            type="text"
            className="campus-edit-input"
            id="campus-edit-input"
            defaultValue={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave(e.target.value);
              }
            }}
          />
          <div className="flex">
            <button onClick={() => handleSave(newName)}>Save</button>{" "}
            <button onClick={() => handleEdit()}>Cancel</button>
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="grid grid-cols-3 hover:bg-bgkPrimary rounded-md px-4 py-2 items-center">
        <p className="">{campus.name}</p>
        <p className="text-center">{campus.student_count}</p>
        <div className="flex gap-4 text-xl">
          <button
            className="IconButton text-textSecondary"
            data-testid="editBtn"
            onClick={() => handleEdit()}
          >
            <FiEdit3 />
          </button>
          <button
            className="IconButton text-btnRed "
            data-testid="deleteBtn"
            onClick={() => handleDelete()}
          >
            <FiTrash2 />
          </button>
        </div>
      </div>
    );
  }
};

const handleNewCampus = (newCampus, setCampuses) => {
  publicService.addCampus(newCampus).then((data) => {
    setCampuses((prevCampuses) => [...prevCampuses, data]);
  });
};

const handleInputError = (input, setError, campuses) => {
  if (input === "") {
    setError("Toimipaikan nimi puuttuu");
    return false;
  }
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

  return (
    <div className="flex flex-col w-full items-center bg-bgkSecondary rounded-md">
      {/* header for mobile*/}
      <div
        className="lg:hidden text-2xl text-center py-4 bg-headerPrimary w-full
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
      <div className="flex flex-col gap-10 w-full max-w-[600px] mt-8 my-4 mb-16 lg:my-8">
        {/* New campus input */}
        <div className="flex text-textPrimary text-xl justify-center">
          <input
            className="text-lg text-textPrimary border-btnGreen bg-bgkSecondary h-10 focus-visible:outline-none border-b p-1"
            type="text"
            data-testid="newCampusInput"
            placeholder="Lisää toimipaikka.."
            onChange={(e) => setNewCampus(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                try {
                  if (!handleInputError(newCampus, setErrorMessage, campuses)) {
                    return;
                  }
                  handleNewCampus(newCampus, setCampuses);
                  e.target.value = "";
                } catch (error) {
                  setErrorMessage(error.response.data);
                }
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-2" id="campusContainer">
          <div className="grid grid-cols-3 w-full text-textSecondary px-4">
            <p className="">Toimipaikka</p>
            <p className="text-center">Opiskelijat</p>
          </div>
          <div className="flex flex-col gap-2">
            {campuses.map((campus) => (
              <CreateCampusContainer
                campus={campus}
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

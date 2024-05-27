import { useState, useEffect } from "react";
import trainingService from "../../../services/trainingService";
import { FiEdit3 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";
import cc from "../../../utils/cc";

// renders a container for a sport while checking if it is being edited
function CreateSportContainer({ sport, sports, setSports }) {
  const [editedSport, setEditedSport] = useState(sport.name);
  const [cellError, setCellError] = useState(false);
  // saves the edited sport to the server and updates the state

  useEffect(() => {
    if (cellError) {
      setTimeout(() => {
        setCellError("");
      }, 5000);
    }
  }, [cellError]);

  const handleSave = () => {
    if (editedSport.length < 2) {
      setCellError("Lajin nimen pituus tulee olla vähintään 2 merkkiä.");
      return;
    }
    if (
      sports.find(
        (oSport) => oSport.name.toLowerCase() === editedSport.toLowerCase()
      )
    ) {
      setCellError("Laji on jo olemassa.");
      return;
    }

    const newSport = {
      id: sport.id,
      student_count: sport.student_count,
      name: editedSport,
    };
    trainingService
      .editSport(newSport)
      .then(() => {
        setSports((prevSports) =>
          prevSports.map((prevSport) =>
            prevSport.id === sport.id ? newSport : prevSport
          )
        );
      })
      .catch((error) => {
        setCellError(error.response.data.error);
      });
  };

  // deletes the sport from the server and updates the state
  const handleDelete = () => {
    trainingService
      .deleteSport(sport.id)
      .then(() => {
        setSports((prevSports) =>
          prevSports.filter((prevSport) => prevSport.id !== sport.id)
        );
      })
      .catch((error) => {
        setCellError(error.response.data.error);
      });
  };

  // sets the sport's "isEditing" property to "true"
  const handleEdit = () => {
    setSports((prevSports) =>
      prevSports.map((prevSport) => {
        if (prevSport.id === sport.id) {
          {
            if (sport.isEditing)
              return {
                id: sport.id,
                name: sport.name,
                student_count: sport.student_count,
              };
            else return { ...prevSport, isEditing: true };
          }
        } else {
          return prevSport;
        }
      })
    );
  };

  if (sport.isEditing) {
    return (
      <div className="flex flex-col">
        <div
          key={sport.id}
          className="flex justify-between  rounded-md  p-2 my-2 gap-4 items-center "
        >
          <input
            className="text-textPrimary bg-bgGray p-1 w-full
            border border-borderPrimary rounded-md
              focus-visible:outline-none"
            type="text"
            id="editSport"
            autoFocus
            defaultValue={sport.name}
            onChange={(e) => setEditedSport(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave(editedSport);
              }
            }}
          />
          <div className="flex gap-4 text-sm">
            <button
              className="Button bg-btnGreen"
              onClick={() => handleSave()}
              data-testid="saveBtn"
            >
              Tallenna
            </button>{" "}
            <button
              className="Button bg-btnGray "
              onClick={() => handleEdit()}
              id="cancelBtn"
            >
              Peruuta
            </button>
          </div>
        </div>
        {/* Error Container */}
        {cellError && (
          <div className="bg-bgSecondary text-red-500 text-center px-2">
            {cellError}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div>
        <div
          key={sport.id}
          className="grid grid-cols-controlpanel3 hover:bg-bgGray rounded-md  p-2 items-center"
        >
          <p>{sport.name}</p>
          <p className="text-center">{sport.student_count}</p>
          <div className="flex gap-4">
            <button
              id="editBtn"
              className="IconButton text-iconGray"
              onClick={() => handleEdit()}
            >
              <FiEdit3 size={20} />
            </button>
            <button
              className="IconButton text-iconRed "
              id="deleteBtn"
              onClick={() => handleDelete()}
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>
        {/* Error Container */}
        {cellError && (
          <div className="bg-bgSecondary text-red-500 text-center p-2">
            {cellError}
          </div>
        )}
      </div>
      // normal Container
    );
  }
}

const SportsPage = () => {
  const [sports, setSports] = useState([]);
  const [sortedSports, setSortedSports] = useState([]);
  const [newSport, setNewSport] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [sorting, setSorting] = useState({
    name: 0,
    student: 0,
  });

  // logic behind creating a new sport
  const handleNewSport = () => {
    if (newSport === "") return;
    if (
      sports.find(
        (sport) => sport.name.toLowerCase() === newSport.toLowerCase()
      )
    ) {
      setErrorMessage("Laji on jo olemassa.");
      return;
    }

    trainingService
      .addSport({ name: newSport })
      .then(() => {
        trainingService.getSports().then((data) => {
          setSports(data);
          setSortedSports(data);
        });

        setNewSport("");
        setErrorMessage("");
      })
      .catch((error) => {
        console.log(error.response.data);
        return;
      });
  };

  // get sports from the server on the first render
  useEffect(() => {
    trainingService.getSports().then((data) => {
      setSports(data);
      setSortedSports(data);
    });
  }, []);

  useEffect(() => {
    if (sorting.name === 0 && sorting.student === 0)
      return setSortedSports(sports);
    if (sorting.name) {
      if (sorting.name === 1) {
        setSortedSports((prevSports) =>
          [...prevSports].sort((a, b) => (a.name > b.name ? 1 : -1))
        );
      } else if (sorting.name === -1) {
        setSortedSports((prevSports) =>
          [...prevSports].sort((a, b) => (a.name < b.name ? 1 : -1))
        );
      }
    }

    if (sorting.student) {
      if (sorting.student === 1) {
        setSortedSports((prevSports) =>
          [...prevSports].sort((a, b) =>
            a.student_count > b.student_count ? 1 : -1
          )
        );
      } else if (sorting.student === -1) {
        setSortedSports((prevSports) =>
          [...prevSports].sort((a, b) =>
            a.student_count < b.student_count ? 1 : -1
          )
        );
      }
    }
  }, [sorting, sports]);

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

  // adds "isEditing" property to the sport object and sets it to "true"

  return (
    <div className="w-full items-center bg-bgSecondary rounded-md ">
      {/* header for mobile*/}
      <div
        className="md:hidden text-2xl text-center py-4 bg-primaryColor w-full
       rounded-b-md shadow-md"
      >
        Lajit
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

      {/* sports container */}
      <div
        className="flex flex-col gap-10 p-4 w-full 
      border border-borderPrimary rounded-md"
      >
        {/* New Sport input */}
        <div className=" flex justify-center">
          <input
            className="text-textPrimary bg-bgGray p-1 
            border border-borderPrimary rounded-l-md
              focus-visible:outline-none"
            type="text"
            data-testid="newSportInput"
            placeholder="Luo laji"
            value={newSport}
            onChange={(e) => setNewSport(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleNewSport();
              }
            }}
          />
          <p
            onClick={() => handleNewSport()}
            className="py-2 px-4 rounded-r-md bg-primaryColor text-white
             hover:bg-hoverPrimary active:scale-95 duration-75 select-none"
          >
            +
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-controlpanel3 px-2 text-textSecondary items-center ">
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
              Laji
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
          {/* container for sport list */}
          <div
            className="flex flex-col divide-y divide-borderPrimary"
            id="sportsContainer"
          >
            {sortedSports.map((sport) => (
              <CreateSportContainer
                sport={sport}
                setSports={setSports}
                sports={sports}
                key={sport.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SportsPage;

import { useState, useEffect } from "react";
import trainingService from "../../../services/trainingService";
import { FiEdit3 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

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

    const newSport = { id: sport.id, name: editedSport };
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
            if (sport.isEditing) return { id: sport.id, name: sport.name };
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
        {/* normal Container */}
        <div
          key={sport.id}
          className="flex justify-between  rounded-md
       px-4 py-2 items-center "
        >
          <input
            className="flex text-textPrimary border-primaryColor bg-bgSecondary focus-visible:outline-none  border-b"
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
              className="w-16 py-1 bg-btnGreen border border-borderPrimary rounded-md "
              onClick={() => handleSave()}
              id="Button bg-btnGreen"
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
          <div className="bg-bgSecondary text-red-500 text-center p-2 mt-2">
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
          className="grid grid-cols-controlpanel3 hover:bg-bgPrimary rounded-md px-4 py-2 items-center"
        >
          <p>{sport.name}</p>
          <p className="text-center">{sport.student_count}</p>
          <div className="flex gap-4 text-xl">
            <button
              id="editBtn"
              className="IconButton text-iconGray"
              onClick={() => handleEdit()}
            >
              <FiEdit3 />
            </button>
            <button
              className="IconButton text-iconRed "
              id="deleteBtn"
              onClick={() => handleDelete()}
            >
              <FiTrash2 />
            </button>
          </div>
        </div>
        {/* Error Container */}
        {cellError && (
          <div className="bg-bgSecondary text-red-500 text-center p-2 mt-2">
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
  const [newSport, setNewSport] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleNewSport = () => {
    if (newSport == "") {
      setErrorMessage("Lajin nimi puuttuu.");
      return;
    }
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
        trainingService.getSports().then((data) => setSports(data));

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
    });
  }, []);

  // adds "isEditing" property to the sport object and sets it to "true"

  return (
    <div className="flex flex-col w-full items-center bg-bgSecondary rounded-md ">
      {/* header for mobile*/}
      <div
        className="lg:hidden text-2xl text-center py-4 bg-primaryColor w-full
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
      <div className="flex flex-col gap-10 w-full max-w-[600px] mt-8 my-4 mb-16 lg:my-8 ">
        {/* New Sport input */}
        <div className=" flex text-textPrimary text-xl justify-center">
          <input
            className="text-lg text-textPrimary border-btnGreen bg-bgSecondary h-10 focus-visible:outline-none border-b p-1"
            type="text"
            data-testid="newSportInput"
            placeholder="Uusi laji..."
            onChange={(e) => setNewSport(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleNewSport();
                e.target.value = "";
              }
            }}
          />
        </div>
        <div className="grid grid-cols-controlpanel3 text-textSecondary px-4">
          <p>Lajit</p>
          <p className="text-center">Oppilaita</p>
          <p className="w-16"></p>
        </div>
        {/* container for sport list */}
        <div className="flex flex-col gap-2" id="sportsContainer">
          {sports.map((sport) => (
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
  );
};

export default SportsPage;

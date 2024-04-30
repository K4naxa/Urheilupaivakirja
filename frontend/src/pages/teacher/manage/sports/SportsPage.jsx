import { useState, useEffect } from "react";
import trainingService from "../../../../services/trainingService";

// renders a container for a sport while checking if it is being edited
function CreateSportContainer({ sport, sports, setSports }) {
  const [editedSport, setEditedSport] = useState(sport.name);
  const [savedSport, setSavedSport] = useState("");
  const [cellError, setCellError] = useState(false);
  // saves the edited sport to the server and updates the state
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
        setSavedSport(editedSport);
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
    setSavedSport(sport.name);
    setSports((prevSports) =>
      prevSports.map((prevSport) => {
        if (prevSport.id === sport.id) {
          {
            if (sport.isEditing) return { id: sport.id, name: savedSport };
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
          className="flex justify-between text-lg rounded-md
       px-4 py-2 items-center "
        >
          <div>
            <input
              className="flex w-full text-textPrimary border-headerPrimary bg-bgkSecondary focus-visible:outline-none  border-b"
              type="text"
              autoFocus
              defaultValue={sport.name}
              onChange={(e) => setEditedSport(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSave(editedSport);
                }
              }}
            />
          </div>
          <div className="flex gap-4">
            <button
              className="w-16 py-1 bg-btnGreen border border-borderPrimary rounded-md "
              onClick={() => handleSave()}
            >
              Save
            </button>{" "}
            <button
              className="w-16 py-1 bg-btnGray border border-borderPrimary rounded-md "
              onClick={() => handleEdit()}
            >
              Cancel
            </button>
          </div>
        </div>
        {/* Error Container */}
        {cellError && (
          <div className="bg-bgkSecondary text-red-500 text-center text-lg p-2 mt-2">
            {cellError}
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div
        key={sport.id}
        className="flex justify-between text-lg hover:bg-bgkPrimary rounded-md px-4 py-2 items-center"
      >
        <div>
          <span>{sport.name}</span>
        </div>
        <div className="flex gap-4">
          <button
            className="w-16 py-1 bg-btnGray border border-borderPrimary rounded-md "
            onClick={() => handleEdit()}
          >
            Edit
          </button>
          <button
            className="w-16 py-1 bg-btnRed border border-borderPrimary rounded-md "
            onClick={() => handleDelete()}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }
}

const SportsPage = () => {
  const [sports, setSports] = useState([]);
  const [newSport, setNewSport] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const handleNewSport = () => {
    if (newSport.length < 2) {
      setErrorMessage("Lajin nimen pituus tulee olla vähintään 2 merkkiä.");
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
      .then((serverSport) => {
        setSports((prevSports) => [
          ...prevSports,
          { name: serverSport.name, id: serverSport.id },
        ]);
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
    <div className="flex flex-col w-full items-center bg-bgkSecondary rounded-md ">
      {/* header for mobile*/}
      <div
        className="lg:hidden text-2xl text-center py-4 bg-headerPrimary w-full
       rounded-b-md shadow-md"
      >
        Lajit
      </div>

      {/* Error Header */}
      {errorMessage && (
        <div
          className="bg-btnRed w-full text-textPrimary text-center text-lg p-2
          mb-4 animate-menu-appear-top shadow-md rounded-b-md"
        >
          {errorMessage}
        </div>
      )}

      {/* sports container */}
      <div className="flex flex-col gap-10 w-full max-w-[600px] mt-8 my-4 mb-16 lg:my-8 ">
        {/* New Sport input */}
        <div className=" flex text-textPrimary text-xl center justify-center">
          <input
            className="text-lg text-textPrimary border-btnGreen bg-bgkSecondary h-10 focus-visible:outline-none border-b p-1"
            type="text"
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
        {/* container for sport list */}
        <div className="flex flex-col gap-2">
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

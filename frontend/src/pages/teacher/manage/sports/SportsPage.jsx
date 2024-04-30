import { useState, useEffect } from "react";
import trainingService from "../../../../services/trainingService";

// renders a container for a sport while checking if it is being edited
const createSportContainer = (sport, setSports) => {
  // saves the edited sport to the server and updates the state
  const handleSave = () => {
    const newSport = { id: sport.id, name: sport.name };
    trainingService.editSport(newSport).then(() => {
      setSports((prevSports) =>
        prevSports.map((prevSport) =>
          prevSport.id === sport.id ? newSport : prevSport
        )
      );
    });
  };

  // deletes the sport from the server and updates the state
  const handleDelete = () => {
    trainingService.deleteSport(sport.id).then(() => {
      setSports((prevSports) =>
        prevSports.filter((prevSport) => prevSport.id !== sport.id)
      );
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
      <div
        key={sport.id}
        className="flex justify-between text-lg hover:shadow-md rounded-md px-4 py-2 items-center"
      >
        <div>
          <input
            className="text-lg text-textPrimary border-btnRed bg-bgkPrimary h-10 focus-visible:outline-none  border-b"
            type="text"
            autoFocus
            defaultValue={sport.name}
            onChange={(e) => (sport.name = e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave(e.target.value);
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
    );
  } else {
    return (
      <div
        key={sport.id}
        className="flex justify-between text-lg hover:shadow-md rounded-md px-4 py-2 items-center"
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
};

const handleNewSport = (newSport, setSports) => {
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

const SportsPage = () => {
  const [sports, setSports] = useState([]);
  const [newSport, setNewSport] = useState("");

  // get sports from the server on the first render
  useEffect(() => {
    trainingService.getSports().then((data) => {
      setSports(data);
    });
  }, []);

  // adds "isEditing" property to the sport object and sets it to "true"

  return (
    <div className="flex flex-col w-full items-center">
      {/* header for mobile*/}
      <div
        className="lg:hidden text-2xl text-center py-4 bg-headerPrimary w-full
       rounded-b-md mb-8 shadow-md"
      >
        Lajit
      </div>

      {/* sports container */}
      <div className="flex flex-col px-4 gap-10 w-full max-w-[600px] mb-4">
        {/* New Sport input */}
        <form className=" flex text-textPrimary text-xl center justify-center">
          <input
            className="text-lg  text-textPrimary border-btnGreen bg-bgkPrimary h-10 focus-visible:outline-none border-b p-1"
            type="text"
            placeholder="Uusi laji..."
            onChange={(e) => setNewSport(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleNewSport(newSport, setSports);
                e.target.value = "";
              }
            }}
          />
        </form>
        {/* container for sport list */}
        <div className="overflow-y-auto">
          {sports.map((sport) => createSportContainer(sport, setSports))}
        </div>
      </div>
    </div>
  );
};

export default SportsPage;

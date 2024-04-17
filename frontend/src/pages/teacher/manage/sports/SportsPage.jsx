import { useState, useEffect } from "react";
import trainingService from "../../../../services/trainingService";
import { useAuth } from "../../../../hooks/useAuth";

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
      <div key={sport.id} className="sportContainer">
        <div>
          <input
            type="text"
            defaultValue={sport.name}
            onChange={(e) => (sport.name = e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave(e.target.value);
              }
            }}
          />
        </div>
        <div>
          <button onClick={() => handleSave()}>Save</button>{" "}
          <button onClick={() => handleEdit()}>Cancel</button>
        </div>
      </div>
    );
  } else {
    return (
      <div key={sport.id} className="sportContainer">
        <div>
          <span>{sport.name}</span>
        </div>
        <div>
          <button onClick={() => handleEdit()}>Edit</button>{" "}
          <button onClick={() => handleDelete()}>Delete</button>
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
  const { user } = useAuth();

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
    <div>
      <h1>Sports</h1>
      <div className="sportsContainer">
        {sports.map((sport) => createSportContainer(sport, setSports))}

        {/* input field for new sports */}
        <div>
          <input
            className="newSportInput"
            type="text"
            placeholder="Add new sport"
            onChange={(e) => setNewSport(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleNewSport(newSport, setSports);
                e.target.value = "";
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default SportsPage;

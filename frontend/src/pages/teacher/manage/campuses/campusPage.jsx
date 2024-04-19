import "./campusPage.css";
import { useState, useEffect } from "react";
import publicService from "../../../../services/publicService";
import { useAuth } from "../../../../hooks/useAuth";

// renders a container for a campus while checking if it is being edited
const createCampusContainer = (campus, setCampuses) => {
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
      <div key={campus.id} className="campus-cell">
        <div className="campus-name">
          <input
            autoFocus
            type="text"
            className="campus-edit-input"
            id="campus-edit-input"
            defaultValue={campus.name}
            onChange={(e) => (campus.name = e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave(e.target.value);
              }
            }}
          />
        </div>
        <div className="campus-buttons">
          <button
            onClick={() =>
              handleSave(document.getElementById("campus-edit-input").value)
            }
          >
            Save
          </button>{" "}
          <button onClick={() => handleEdit()}>Cancel</button>
        </div>
      </div>
    );
  } else {
    return (
      <div key={campus.id} className="campus-cell">
        <div className="campus-name">{campus.name}</div>
        <div className="campus-buttons">
          <button onClick={() => handleEdit()}>Edit</button>
          <button onClick={() => handleDelete()}>Delete</button>
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
  const { user } = useAuth();
  const [campuses, setCampuses] = useState([]);
  const [newCampus, setNewCampus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    publicService.getCampuses().then((data) => setCampuses(data));
  }, []);

  return (
    <div id="campus-page">
      <div className="campus-container">
        <div className="campus-page-header">
          <h1 className="campus-header-title">Toimipaikat</h1>
        </div>
        <div className="campus-list-container">
          {/* input field for new sports */}
          <div>
            <span className="error-message">{error}</span> <br />
            <input
              className="new-campus-input"
              type="text"
              placeholder="Lisää uusi toimipaikka"
              onChange={(e) => setNewCampus(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  try {
                    if (!handleInputError(newCampus, setError, campuses)) {
                      return;
                    }
                    handleNewCampus(newCampus, setCampuses);
                    e.target.value = "";
                  } catch (error) {
                    console.log(error.response.data);
                  }
                }
              }}
            />
          </div>
          <div className="campus-list">
            {campuses.map((campus) =>
              createCampusContainer(campus, setCampuses)
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampusPage;

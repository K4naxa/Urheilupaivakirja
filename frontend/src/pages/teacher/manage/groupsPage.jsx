import publicService from "../../../services/publicService";
import { FiEdit3 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

import { useState, useEffect } from "react";

// renders a container for a group while checking if it is being edited
function CreateGroupContainer({ group, setGroups, groups }) {
  const [editedGroup, setEditedGroup] = useState(group.group_identifier);
  const [cellError, setCellError] = useState(false);

  useEffect(() => {
    if (cellError) {
      setTimeout(() => {
        setCellError("");
      }, 5000);
    }
  }, [cellError]);

  // saves the edited group to the server and updates the state
  const handleSave = () => {
    if (editedGroup.length < 4) {
      setCellError("Ryhmän nimen pituus tulee olla vähintään 4 merkkiä.");
      return;
    }
    if (
      groups.find(
        (oGroup) =>
          oGroup.group_identifier.toLowerCase() === editedGroup.toLowerCase()
      )
    ) {
      setCellError("Ryhmä on jo olemassa.");
      return;
    }

    const newGroup = {
      id: group.id,
      student_count: group.student_count,
      group_identifier: editedGroup,
    };
    publicService
      .editGroup(newGroup)
      .then(() => {
        setGroups((prevGroups) =>
          prevGroups.map((prevGroup) =>
            prevGroup.id === group.id ? newGroup : prevGroup
          )
        );
      })
      .catch((error) => {
        setCellError(error.response.data.error);
      });
  };

  // deletes the group from the server and updates the state
  const handleDelete = () => {
    publicService
      .deleteGroup(group.id)
      .then(() => {
        setGroups((prevGroups) =>
          prevGroups.filter((prevGroup) => prevGroup.id !== group.id)
        );
      })
      .catch((error) => {
        setCellError(error.response.data.error);
      });
  };

  // sets the sport's "isEditing" property to "true"
  const handleEdit = () => {
    setGroups((prevGroups) =>
      prevGroups.map((prevGroups) => {
        if (prevGroups.id === group.id) {
          {
            if (group.isEditing)
              return {
                id: group.id,
                student_count: group.student_count,
                group_identifier: group.group_identifier,
              };
            else return { ...prevGroups, isEditing: true };
          }
        } else {
          return prevGroups;
        }
      })
    );
  };

  if (group.isEditing) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-between rounded-md gap-8 px-4 py-2 bg-bgPrimary">
          <input
            autoFocus
            type="text"
            className="flex w-full text-textPrimary border-headerPrimary bg-bgPrimary focus-visible:outline-none  border-b"
            data-testid="editCampus"
            defaultValue={editedGroup}
            onChange={(e) => setEditedGroup(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave(e.target.value);
              }
            }}
          />
          <div className="flex gap-4 text-sm">
            <button
              data-testid="saveBtn"
              onClick={() => handleSave(editedGroup)}
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
        {cellError && <p className="text-btnRed px-4">{cellError}</p>}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col">
        {/* main Container */}
        <div className="grid grid-cols-controlpanel3 hover:bg-bgPrimary rounded-md px-4 py-2 items-center">
          <p className="">{group.group_identifier}</p>
          <p className="text-center">{group.student_count}</p>
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

        {/* error container */}
        {cellError && <p className="text-btnRed px-4">{cellError}</p>}
      </div>
    );
  }
}

const GroupsPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");

  useEffect(() => {
    publicService.getGroups().then((data) => {
      setGroups(data);
    });
  }, []);

  // Creates a new group of the input and adds it to the server and state
  const handleNewGroup = () => {
    if (newGroup === "") {
      setErrorMessage("Ryhmän nimi ei voi olla tyhjä");
      return;
    }
    if (
      groups.some(
        (group) =>
          group.group_identifier.toLowerCase() === newGroup.toLocaleLowerCase()
      )
    ) {
      setErrorMessage("Ryhmä on jo olemassa");
      return;
    }
    if (newGroup.length < 4) {
      setErrorMessage("Ryhmän nimi liian lyhyt");
      return;
    }

    publicService.addGroup(newGroup).then((group) => {
      setGroups((prevGroups) => [...prevGroups, group]);
      setErrorMessage("");
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

  return (
    <div className="flex flex-col w-full items-center bg-bgSecondary rounded-md">
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
            className="text-lg text-textPrimary border-btnGreen bg-bgSecondary h-10 focus-visible:outline-none border-b p-1"
            type="text"
            data-testid="newCampusInput"
            placeholder="Lisää toimipaikka.."
            onChange={(e) => setNewGroup(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                try {
                  if (!handleInputError(newGroup, setErrorMessage, groups)) {
                    return;
                  }
                  handleNewGroup(newGroup, setNewGroup);
                  e.target.value = "";
                } catch (error) {
                  setErrorMessage(error.response.data);
                }
              }
            }}
          />
        </div>
        <div className="flex flex-col gap-2" id="campusesContainer">
          <div className="grid grid-cols-controlpanel3 w-full text-textSecondary px-4">
            <p className="">Ryhmä</p>
            <p className="text-center">Opiskelijat</p>
            <div className="w-16" />
          </div>
          <div className="flex flex-col gap-2">
            {groups.map((group) => (
              <CreateGroupContainer
                groups={groups}
                setGroups={setGroups}
                group={group}
                key={group.group_identifier}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
// Path: frontEnd/src/pages/teacher/manage/student-groups/groupsPage.css'

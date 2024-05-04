import publicService from "../../../services/publicService";

import { useState, useEffect } from "react";

// renders a container for a group while checking if it is being edited
function CreateGroupContainer({ group, setGroups, groups }) {
  const [editedGroup, setEditedGroup] = useState(group.group_identifier);
  const [cellError, setCellError] = useState(false);
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

    const newGroup = { id: group.id, group_identifier: editedGroup };
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
    publicService.deleteGroup(group.id).then(() => {
      setGroups((prevGroups) =>
        prevGroups.filter((prevGroup) => prevGroup.id !== group.id)
      );
    });
  };

  // sets the sport's "isEditing" property to "true"
  const handleEdit = () => {
    setGroups((prevGroups) =>
      prevGroups.map((prevGroups) => {
        if (prevGroups.id === group.id) {
          {
            if (group.isEditing)
              return { id: group.id, group_identifier: group.group_identifier };
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
        <div
          key={group.id}
          className="flex justify-between text-lg rounded-md
       px-4 py-2 items-center "
        >
          <input
            type="text"
            id="editInput"
            className="flex text-textPrimary border-headerPrimary bg-bgkSecondary focus-visible:outline-none  border-b"
            defaultValue={group.group_identifier}
            onChange={(e) => setEditedGroup(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave(editedGroup);
              }
            }}
          />

          <div className="flex gap-4">
            <button
              className="w-16 py-1 bg-btnGreen border border-borderPrimary rounded-md "
              onClick={() => handleSave()}
              id="saveBtn"
            >
              Save
            </button>{" "}
            <button
              className="w-16 py-1 bg-btnGray border border-borderPrimary rounded-md "
              onClick={() => handleEdit()}
              id="cancelBtn"
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
        key={group.id}
        className="flex justify-between text-lg hover:bg-bgkPrimary rounded-md px-4 py-2 items-center"
      >
        <span>{group.group_identifier}</span>
        <div className="flex gap-4">
          <button
            className="w-16 py-1 bg-btnGray border border-borderPrimary rounded-md "
            onClick={() => handleEdit()}
            id="editBtn"
          >
            Edit
          </button>{" "}
          <button
            className="w-16 py-1 bg-btnRed border border-borderPrimary rounded-md "
            onClick={() => handleDelete()}
            id="deleteBtn"
          >
            Delete
          </button>
        </div>
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

  return (
    <div className="flex flex-col w-full items-center bg-bgkSecondary rounded-md">
      {/* header for mobile*/}
      <div
        className="lg:hidden text-2xl text-center py-4 bg-headerPrimary w-full
       rounded-b-md shadow-md"
      >
        Ryhmät
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

      {/* Group Container */}
      <div className="flex flex-col gap-10 w-full max-w-[600px] mt-8 my-4 mb-16 lg:my-8 ">
        {/* new Group Input */}
        <div className="flex text-textPrimary text-xl center justify-center">
          <input
            className="text-lg text-textPrimary border-btnGreen bg-bgkSecondary h-10 focus-visible:outline-none border-b p-1"
            type="text"
            placeholder="Uusi ryhmä..."
            onChange={(e) => setNewGroup(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleNewGroup();
                e.target.value = "";
              }
            }}
          />
        </div>
        {/* container for group list */}
        <div className="flex flex-col gap-2" id="groupsContainer">
          {groups.map((group) => (
            <CreateGroupContainer
              group={group}
              setGroups={setGroups}
              groups={groups}
              key={group.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GroupsPage;
// Path: frontEnd/src/pages/teacher/manage/student-groups/groupsPage.css'

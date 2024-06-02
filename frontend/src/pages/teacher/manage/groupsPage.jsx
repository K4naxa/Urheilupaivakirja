import publicService from "../../../services/publicService";
import { FiEdit3 } from "react-icons/fi";
import { FiTrash2 } from "react-icons/fi";

import { useState, useEffect } from "react";
import cc from "../../../utils/cc";

// renders a container for a group while checking if it is being edited
function CreateGroupContainer({ group, setGroups, groups }) {
  const [isEditing, setIsEditing] = useState(false);
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
        setIsEditing(false);
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
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditedGroup(group.group_identifier);
      setIsEditing(false);
    }
    if (!isEditing) {
      setIsEditing(true);
    }
  };

  if (isEditing) {
    return (
      <div className="flex flex-col">
        <div className="flex justify-between  rounded-md  p-2 my-2 gap-4 items-center">
          <input
            autoFocus
            type="text"
            className="text-textPrimary bg-bgGray p-1 w-full
            border border-borderPrimary rounded-md
              focus-visible:outline-none"
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
        {cellError && <p className="text-btnRed px-2">{cellError}</p>}
      </div>
    );
  } else {
    return (
      <div className="flex flex-col">
        {/* main Container */}
        <div className="grid grid-cols-controlpanel3 hover:bg-bgGray rounded-md p-2 items-center">
          <p className="">{group.group_identifier}</p>
          <p className="text-center">{group.student_count}</p>
          <div className="flex gap-4 ">
            <button
              className="IconButton text-iconGray"
              data-testid="editBtn"
              onClick={() => handleEdit()}
            >
              <FiEdit3 size={20} />
            </button>
            <button
              className="IconButton text-iconRed "
              data-testid="deleteBtn"
              onClick={() => handleDelete()}
            >
              <FiTrash2 size={20} />
            </button>
          </div>
        </div>

        {/* error container */}
        {cellError && (
          <p className="text-btnRed px-4 text-center p-2 ">{cellError}</p>
        )}
      </div>
    );
  }
}

const GroupsPage = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [groups, setGroups] = useState([]);
  const [sortedGroups, setSortedGroups] = useState([]);
  const [newGroup, setNewGroup] = useState("");
  const [sorting, setSorting] = useState({ name: 0, group: 0 });

  useEffect(() => {
    publicService.getGroups().then((data) => {
      setGroups(data);
      setSortedGroups(data);
    });
  }, []);

  useEffect(() => {
    if (sorting.name === 0 && sorting.student === 0)
      return setSortedGroups(groups);
    if (sorting.name) {
      if (sorting.name === 1) {
        setSortedGroups((prevSports) =>
          [...prevSports].sort((a, b) => (a.name > b.name ? 1 : -1))
        );
      } else if (sorting.name === -1) {
        setSortedGroups((prevSports) =>
          [...prevSports].sort((a, b) => (a.name < b.name ? 1 : -1))
        );
      }
    }

    if (sorting.student) {
      if (sorting.student === 1) {
        setSortedGroups((prevSports) =>
          [...prevSports].sort((a, b) =>
            a.student_count > b.student_count ? 1 : -1
          )
        );
      } else if (sorting.student === -1) {
        setSortedGroups((prevSports) =>
          [...prevSports].sort((a, b) =>
            a.student_count < b.student_count ? 1 : -1
          )
        );
      }
    }
  }, [sorting, groups]);

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

  // Creates a new group of the input and adds it to the server and state
  const handleNewGroup = () => {
    if (newGroup === "") return;

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

    publicService.addGroup(newGroup).then(() => {
      publicService.getGroups().then((data) => {
        setGroups(data);
      });
      setNewGroup("");
      setErrorMessage("");
    });
  };

  const handleInputError = (input, setError, campuses) => {
    if (input === "") {
      setError("Ryhmän nimi puuttuu");
      return false;
    }
    if (input.length > 20) {
      setError("Ryhmän nimi liian pitkä");
      return false;
    }
    if (campuses.some((campus) => campus.name === input)) {
      setError("Ryhmä on jo olemassa");
      return false;
    }

    setError("");
    return true;
  };

  return (
    <div className="w-full items-center bg-bgSecondary rounded-md">
      {/* header for mobile*/}
      <div
        className="md:hidden text-2xl text-center py-4 bg-primaryColor w-full
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

      {/* Campus Container */}
      <div className="flex flex-col gap-8 p-4 w-full border border-borderPrimary rounded-md">
        {/* New campus input */}
        <div className=" flex justify-center mt-4">
          <input
            className="text-textPrimary bg-bgGray p-1 
            border border-borderPrimary rounded-l-md
              focus-visible:outline-none"
            type="text"
            data-testid="newSportInput"
            placeholder="Luo Ryhmä"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleNewGroup();
              }
            }}
          />
          <p
            onClick={() => handleNewGroup()}
            className="py-2 px-4 rounded-r-md bg-primaryColor text-white
             hover:bg-hoverPrimary active:scale-95 duration-75 select-none"
          >
            +
          </p>
        </div>
        <div className="flex flex-col gap-2" id="campusesContainer">
          <div className="grid grid-cols-controlpanel3 w-full text-textSecondary px-2">
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
          <div className="flex flex-col divide-y divide-borderPrimary">
            {sortedGroups.map((group) => (
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

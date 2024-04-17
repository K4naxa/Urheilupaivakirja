import "./groupsPage.css";
import publicService from "../../../../services/publicService";

import { useState, useEffect } from "react";

// renders a container for a group while checking if it is being edited
const createGroupContainer = (group, setGroups) => {
  // saves the edited group to the server and updates the state
  const handleSave = () => {
    const newGroup = { id: group.id, name: group.group_identifier };
    publicService.editGroup(newGroup).then(() => {
      setGroups((prevGroups) =>
        prevGroups.map((prevGroup) =>
          prevGroup.id === group.id ? newGroup : prevGroup
        )
      );
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
              return { id: group.id, name: group.group_identifier };
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
      <div key={group.id} className="sportContainer">
        <div>
          <input
            type="text"
            defaultValue={group.group_identifier}
            onChange={(e) => (group.group_identifier = e.target.value)}
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
      <div key={group.id} className="sportContainer">
        <div>
          <span>{group.group_identifier}</span>
        </div>
        <div>
          <button onClick={() => handleEdit()}>Edit</button>{" "}
          <button onClick={() => handleDelete()}>Delete</button>
        </div>
      </div>
    );
  }
};

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);

  useEffect(() => {
    publicService.getGroups().then((data) => {
      setGroups(data);
      console.log(data);
    });
  }, []);

  return (
    <div className="groupsPage">
      <h1>Student Groups</h1>
      <div className="groupsContainer">
        {groups.map((group) => createGroupContainer(group, setGroups))}
      </div>
    </div>
  );
};

export default GroupsPage;
// Path: frontEnd/src/pages/teacher/manage/student-groups/groupsPage.css'

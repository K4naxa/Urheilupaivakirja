import "./groupsPage.css";

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);

  return (
    <div className="groupsPage">
      <h1>Student Groups</h1>
    </div>
  );
};

export default GroupsPage;
// Path: frontEnd/src/pages/teacher/manage/student-groups/groupsPage.css'

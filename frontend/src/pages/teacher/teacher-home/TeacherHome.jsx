import trainingService from "../../../services/trainingService.js";
import dayjs from "dayjs";
import HeatMap_Month from "../../../components/HeatMap_Month.jsx";
import HeatMap_Year from "../../../components/HeatMap_Year.jsx";

import { useEffect, useState } from "react";

function TeacherHome() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    trainingService
      .getJournalEntries()
      .then((response) => {
        setJournals(response);
        console.log(response);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (journals.length > 0) {
      setLoading(false);
    }
  }, [journals]);

  if (loading) {
    return <div>Loading...</div>;
  } else
    return (
      <div className="teacherHomeContainer">
        <div className="teacherHomeContent">
          <h1>Teacher Home</h1>
          <HeatMap_Year journal={journals} />
          <HeatMap_Month journal={journals} />
        </div>
      </div>
    );
}
export default TeacherHome;

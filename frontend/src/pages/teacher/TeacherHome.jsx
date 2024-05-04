import trainingService from "../../services/trainingService.js";
import HeatMap_Year from "../../components/HeatMap_Year.jsx";
import HeatMap_Month from "../../components/HeatMap_Month.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";

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
    return (
      <>
        <LoadingScreen />
      </>
    );
  } else return <div className="teacherHomeContainer">Teacher home</div>;
}
export default TeacherHome;

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

  console.log(journals);

  if (loading) {
    return (
      <>
        <LoadingScreen />
      </>
    );
  } else
    return (
      <div className="flex flex-col w-full ">
        <div className="bg-bgkSecondary">
          <input
            type="text"
            name="nameFilter"
            id="nameFilter"
            placeholder="Hae Opiskelija"
          />
        </div>
        <div></div>
      </div>
    );
}
export default TeacherHome;

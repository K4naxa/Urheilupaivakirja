import trainingService from "../../services/trainingService.js";
import HeatMap_Year from "../../components/HeatMap_Year.jsx";
import HeatMap_Month from "../../components/HeatMap_Month.jsx";
import HeatMap_Weeks from "../../components/HeatMap_Weeks.jsx";
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
  } else
    return (
      <div className="w-full text-textPrimary">
        <div className="bg-bgkSecondary">
          <input
            type="text"
            name="nameFilter"
            id="nameFilter"
            placeholder="Hae Opiskelija"
          />
        </div>
        <div className="flex flex-col gap-8 rounded-md border">
          <p>Opiskelijat</p>
          {journals.map((journal) => (
            <div
              key={journal.user_id}
              className="rounded-md bg-bgkSecondary p-4"
            >
              <div className="flex gap-8">
                <p className="text-lg">
                  {journal.first_name} {journal.last_name}
                </p>
                <div className="flex gap-4 align-bottom text-textSecondary">
                  <p className="align-bottom">{journal.campus}</p>
                  <p>{journal.group}</p>
                  <p>{journal.sport}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
}
export default TeacherHome;

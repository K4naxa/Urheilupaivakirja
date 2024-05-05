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
      <div className="flex gap-8 flex-col lg:m-8 lg:flex-row w-full text-textPrimary">
        {/* filters */}
        <div
          className="bg-bgkSecondary flex flex-wrap align-middle lg:justify-center rounded-md
         h-fit w-full p-4 justify-between lg:p-8 lg:gap-8 lg:fixed lg:flex-col lg:w-64 lg:top-1/2 lg:transform lg:-translate-y-1/2 shadow-md"
        >
          <div className="w-2/5 lg:w-full">
            <input
              type="text"
              name="nameFilter"
              id="nameFilter"
              className="w-full"
              placeholder="Hae Opiskelija"
            />
          </div>
          <div className="w-2/5 lg:w-full">
            <input
              type="text"
              name="groupFilter"
              id="groupFilter"
              className="w-full"
              placeholder="Hae Ryhmä"
            />
          </div>
          <div className="w-2/5 lg:w-full">
            <input
              type="text"
              name="sportFilter"
              id="sportFilter"
              className="w-full"
              placeholder="Hae Laji"
            />
          </div>
          <div className="w-2/5 lg:w-full">
            <input
              type="text"
              name="campusFilter"
              id="campusFilter"
              className="w-full"
              placeholder="Hae Kampus"
            />
          </div>
          <div className="flex lg:gap-8 justify-center text-sm">
            <button className="Button">Filtteröi</button>{" "}
            <button className="Button bg-btnGray">Nollaa</button>
          </div>
        </div>
        <div
          id="studentList"
          className="flex lg:ml-72 flex-col gap-8 rounded-md bg-bgkSecondary p-4 w-full"
        >
          {journals.map((journal) => (
            <div
              key={journal.user_id}
              className="rounded-md bg-bgkSecondary p-4 border border-headerPrimary shadow-md"
              id="studentCard"
            >
              <div className="flex gap-8">
                <p className="text-lg">
                  {journal.first_name} {journal.last_name}
                </p>
                <div className="flex flex-wrap lg:gap-4 align-bottom text-textSecondary text-sm">
                  <p className="align-bottom hidden lg:flex">
                    Toimipiste: {journal.campus}
                  </p>
                  <p>ryhmä: {journal.group}</p>
                  <p>Laji: {journal.sport}</p>
                </div>
              </div>
              <HeatMap_Weeks journal={journal} />
            </div>
          ))}
        </div>
      </div>
    );
}
export default TeacherHome;

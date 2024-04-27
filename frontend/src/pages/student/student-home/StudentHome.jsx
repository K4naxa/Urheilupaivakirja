import { useMainContext } from "../../../hooks/mainContext";
import PractiseBoxes from "../../../components/PractiseBoxes";
import HeatMap_Month from "../../../components/HeatMap_Month";
import HeatMap_Year from "../../../components/HeatMap_Year";
import RecentJournalEntries from "../../../components/recent-journal-entries/RecentJournalEntries";
import WorkoutIntensityChart from "../../../components/WorkoutIntensityChart";
import WorkoutActivityChart from "../../../components/WorkoutActivityChart";
import { useState, useEffect } from "react";

function StudentHome() {
  const { studentJournal } = useMainContext();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentJournal) {
      setLoading(false);
    }
  }, [studentJournal]);

  if (loading) {
    return (
      <div className={`flex justify-center align-middle`}>
        <h1>Loading...</h1>
      </div>
    );
  } else
    return (
      <div className="mainArea overflow-x-auto pb-14">
        <div className=" hidden md:justify-center lg:flex"></div>
        <div
          className={`bg-bgkPrimary text-textPrimary lg::grid-rows-2 grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-12`}
        >
          <div className=" flex flex-col justify-between gap-4 align-middle md:gap-12">
            <HeatMap_Month journal={studentJournal} />
            <PractiseBoxes journalEntries={studentJournal} />
          </div>
          <div className=" flex flex-col gap-4">
            <WorkoutActivityChart journal={studentJournal} />
            <WorkoutIntensityChart journal={studentJournal} />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <RecentJournalEntries />
          </div>
          <div className="flex  overflow-x-auto sm:col-span-2 lg:col-span-3">
            <HeatMap_Year journal={studentJournal} />
          </div>
        </div>
      </div>
    );
}

export default StudentHome;

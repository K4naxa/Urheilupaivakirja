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
      <div className="mainArea min-w-[370px] overflow-x-scroll">
        <div className=" hidden lg:flex md:justify-center">
          <button className="text-xl px-6 py-4 bg-graphPrimary rounded-md ">
            Uusi Harjoitus
          </button>
        </div>
        <div
          className={`bg-bgkPrimary text-textPrimary grid gap-4 md:gap-8 lg:gap-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 lg::grid-rows-2 p-4`}
        >
          <div className=" flex flex-col align-middle gap-4 md:gap-12 justify-between">
            <HeatMap_Month journal={studentJournal} />
            <PractiseBoxes journalEntries={studentJournal} />
          </div>
          <div className=" flex flex-col gap-8">
            <WorkoutActivityChart journal={studentJournal} />
            <WorkoutIntensityChart journal={studentJournal} />
          </div>
          <div className="lg:col-span-1 sm:col-span-2">
            <RecentJournalEntries />
          </div>
          <div className="flex  lg:col-span-3 sm:col-span-2 overflow-x-scroll">
            <HeatMap_Year journal={studentJournal} />
          </div>
        </div>
      </div>
    );
}

export default StudentHome;

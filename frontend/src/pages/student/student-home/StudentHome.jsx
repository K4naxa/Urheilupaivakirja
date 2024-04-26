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
      <div className="mainArea ">
        <div className=" hidden md:flex md:justify-center">
          <button className="text-xl px-6 py-4 bg-graphPrimary rounded-md ">
            Uusi Harjoitus
          </button>
        </div>
        <button className="size-20 text-3xl shadow-xl absolute right-5 bottom-10 bg-graphPrimary rounded-full">
          +
        </button>
        <div
          className={`bg-bgkPrimary text-textPrimary grid gap-4 md:gap-12 grid-cols-1 md:grid-cols-3 md:grid-rows-2 p-4`}
        >
          <div className=" flex flex-col align-middle gap-4 md:gap-12 justify-between">
            <HeatMap_Month journal={studentJournal} />
            <PractiseBoxes journalEntries={studentJournal} />
          </div>
          <div className=" flex flex-col gap-8">
            <WorkoutActivityChart journal={studentJournal} />
            <WorkoutIntensityChart journal={studentJournal} />
          </div>
          <div className="">
            <RecentJournalEntries />
          </div>
          <div className="flex  md:col-span-3 overflow-x-scroll">
            <HeatMap_Year journal={studentJournal} />
          </div>
        </div>
      </div>
    );
}

export default StudentHome;

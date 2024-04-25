import { useMainContext } from "../../../hooks/mainContext";
import PractiseBoxes from "../../../components/PractiseBoxes";
import HeatMap_Month from "../../../components/HeatMap_Month";
import HeatMap_Year from "../../../components/HeatMap_Year";
import RecentJournalEntries from "../../../components/recent-journal-entries/RecentJournalEntries";
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
      <div
        className={`bg-bgkPrimary text-textPrimary grid grid-cols-mainPage  grid-rows-mainPage justify-center gap-4 p-4`}
      >
        <div className=" flex flex-col row-start-1 row-span-2 align-middle justify-center">
          <HeatMap_Month journal={studentJournal} />
          <PractiseBoxes journalEntries={studentJournal} />
        </div>
        <div className="row-start-1 col-start-2">
          <WorkoutActivityChart journal={studentJournal} />
        </div>
        <div className="block row-start-1 row-span-2 col-start-3 overflow-y-scroll max-h-96">
          <RecentJournalEntries />
        </div>
        <div className="flex row-start-3 row-span-1 col-span-2">
          <HeatMap_Year journal={studentJournal} />
        </div>
      </div>
    );
}

export default StudentHome;

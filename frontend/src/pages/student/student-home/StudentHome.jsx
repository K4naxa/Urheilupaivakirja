import { useMainContext } from "../../../hooks/mainContext";
import PractiseBoxes from "../../../components/PractiseBoxes";
import HeatMap_Month from "../../../components/HeatMap_Month";
import HeatMap_Year from "../../../components/HeatMap_Year";
import { useState, useEffect } from "react";

function StudentHome() {
  const { theme, studentJournal } = useMainContext();
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
        className={`bg-primary-${theme} grid grid-cols-3 grid-rows-3 gap-4 p-4`}
      >
        <HeatMap_Month journal={studentJournal} />
        <PractiseBoxes journalEntries={studentJournal} />
      </div>
    );
}

export default StudentHome;

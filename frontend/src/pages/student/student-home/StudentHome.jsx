import { useMainContext } from "../../../hooks/mainContext";
import PractiseBoxes from "../../../components/PractiseBoxes";
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
        className={`bg-primary-${theme} flex flex-col justify-center text-primary-${theme}`}
      >
        <h1 className="text-xl">Student Home</h1>
        <p className="text-lg">Welcome to the student home page</p>

        <PractiseBoxes journalEntries={studentJournal} />
      </div>
    );
}

export default StudentHome;

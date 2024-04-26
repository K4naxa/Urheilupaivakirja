import { useEffect, useState } from "react";
import trainingService from "../../services/trainingService";
import { useNavigate } from "react-router-dom";
import { FiEdit3 } from "react-icons/fi";

const convertTime = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  if (hours === 0) {
    return `${minutes}min`;
  }
  if (minutes === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${minutes}min`;
};

function formatDateString(isoDateString) {
  const date = new Date(isoDateString);

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDateToDisplay(isoDateString) {
  const formattedDate = formatDateString(isoDateString);
  const [year, month, day] = formattedDate.split("-");
  return `${day}.${month}.${year}`;
}

const dataContainerClass = "grid grid-cols-2 gap-2";

const RecentJournalEntry = ({ entry }) => {
  const navigate = useNavigate();
  return (
    <div className=" flex flex-col w-full bg-bgkSecondary rounded-md shadow-sm ">
      {/* Header */}
      <div className="grid grid-cols-3 bg-bgkSecondary rounded-t-md border-b-2 border-graphPrimary py-2  ">
        {entry.entry_type &&
          (entry.entry_type === "Lepo" || entry.entry_type === "Sairaana") && (
            <p className="col-start-1 mx-2 justify-self-start text-textPrimary">
              {entry.entry_type}
            </p>
          )}
        {entry.date && (
          <p className="col-start-2 text-textPrimary text-center">
            {formatDateToDisplay(entry.date)}
          </p>
        )}
        <button
          onClick={() => navigate(`/merkinnat/muokkaa/${entry.id}`)}
          className="col-start-3 justify-self-end mx-4"
        >
          <FiEdit3 />
        </button>
      </div>
      {/* content container */}
      <div className="w-full p-2 pb-0 grid gap-2 grid-cols-1 md:grid-cols-2">
        {/* left Container */}
        <div>
          {entry.length_in_minutes && (
            <div className={dataContainerClass}>
              <span className="text-textSecondary">Kesto:</span>
              <span className="text-textPrimary">
                {convertTime(entry.length_in_minutes)}
              </span>
            </div>
          )}

          {entry.intensity && (
            <div className={dataContainerClass}>
              <span className="label">Rankkuus:</span>
              <span className="value">{entry.intensity}</span>
            </div>
          )}
        </div>
        {/* right Container */}
        <div>
          {entry.workout_category && (
            <div className={dataContainerClass}>
              <span className="label">Laji:</span>
              <span className="value">{entry.workout_category}</span>
            </div>
          )}
          {entry.time_of_day && (
            <div className={dataContainerClass}>
              <span className="label">Aika:</span>
              <span className="value">{entry.time_of_day}</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-2">
        {entry.details && (
          <div className=" flex flex-wrap gap-2">
            <span className="label">Lisätiedot:</span>
            <span className="value">{entry.details}</span>
          </div>
        )}
      </div>
    </div>
  );
};

const RecentJournalEntries = () => {
  const [recentEntries, setRecentEntries] = useState([]);
  useEffect(() => {
    //TODO: get recent journal entries instead of all
    const fetchRecentJournalEntries = async () => {
      try {
        const data = await trainingService.getAllUserJournalEntries();
        setRecentEntries(data);
      } catch (error) {
        console.error("Failed to fetch journal entries:", error);
      }
    };
    fetchRecentJournalEntries();
  }, []);

  return (
    <div className=" flex flex-col max-h-[570px] w-full gap-2 ">
      <h2 className="text-lg">Viimeisimmät merkinnät</h2>
      <div className="flex flex-col w-full overflow-y-auto gap-4 rounded-md  scroll-smooth">
        {recentEntries.map((entry) => (
          <RecentJournalEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
};

export default RecentJournalEntries;

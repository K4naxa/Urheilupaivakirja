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

const dataContainerClass = "grid grid-cols-merkInfo gap-2";
const labelClass = "text-textSecondary min-w-16";

const RecentJournalEntry = ({ entry }) => {
  const navigate = useNavigate();
  return (
    <div className=" bg-bgkSecondary flex w-full snap-start flex-col rounded-md p-2 shadow-md shadow-gray-700 ">
      {/* Header */}
      <div className="bg-bgkSecondary border-graphPrimary grid grid-cols-3 rounded-t-md border-b-2 py-2  ">
        {entry.entry_type &&
          (entry.entry_type === "Lepo" || entry.entry_type === "Sairaana") && (
            <p className="text-textPrimary col-start-1 mx-2 justify-self-start">
              {entry.entry_type}
            </p>
          )}
        {entry.date && (
          <p className="text-textPrimary col-start-2 text-center">
            {formatDateToDisplay(entry.date)}
          </p>
        )}
        <button
          onClick={() => navigate(`/merkinnat/muokkaa/${entry.id}`)}
          className="col-start-3 mx-4 justify-self-end"
        >
          <FiEdit3 />
        </button>
      </div>
      {/* content container */}
      <div className="grid w-full grid-cols-2 gap-2 p-2 pb-0">
        {/* left Container */}
        <div>
          {entry.length_in_minutes && (
            <div className={dataContainerClass}>
              <span className={labelClass}>Kesto:</span>
              <span className="text-textPrimary">
                {convertTime(entry.length_in_minutes)}
              </span>
            </div>
          )}

          {entry.intensity && (
            <div className={dataContainerClass}>
              <span className={labelClass}>Rankkuus:</span>
              <span className="value">{entry.intensity}</span>
            </div>
          )}
        </div>
        {/* right Container */}
        <div>
          {entry.workout_category && (
            <div className={dataContainerClass}>
              <span className={labelClass}>Laji:</span>
              <span className="value">{entry.workout_category}</span>
            </div>
          )}
          {entry.time_of_day && (
            <div className={dataContainerClass}>
              <span className={labelClass}>Aika:</span>
              <span className="value">{entry.time_of_day}</span>
            </div>
          )}
        </div>
      </div>
      <div className="p-2">
        {entry.details && (
          <div className=" flex flex-wrap gap-2">
            <span className={labelClass}>Lisätiedot:</span>
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
    <div className=" flex max-h-[570px] w-full flex-col gap-2 ">
      <h2 className="text-lg">Viimeisimmät merkinnät</h2>
      <div className="flex w-full snap-y scroll-m-1 flex-col gap-4 overflow-y-auto  overscroll-none scroll-smooth rounded-md">
        {recentEntries.map((entry) => (
          <RecentJournalEntry key={entry.id} entry={entry} />
        ))}
      </div>
    </div>
  );
};

export default RecentJournalEntries;

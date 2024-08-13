import { FiBarChart2, FiEdit3 } from "react-icons/fi";
import { useJournalModal } from "../hooks/useJournalModal";
import { useAuth } from "../hooks/useAuth";
import dayjs from "dayjs";
import cc from "../utils/cc";

import { useMainContext } from "../hooks/mainContext";
import { useEffect, useState } from "react";
import { isSameMonth, isSameYear } from "date-fns";

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

const RecentJournalEntry = ({ entry }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useAuth();
  const { openBigModal } = useJournalModal();

  return (
    <div
      className={`grid items-center p-2 grid-cols-5 md:grid-cols-6 gap-1 md:gap-4 hover:bg-hoverDefault ${
        isOpen ? "row-span-2" : ""
      }`}
      onClick={() => setIsOpen(!isOpen)}
    >
      {/* Date */}
      <p className="hidden md:flex">{dayjs(entry.date).format("DD.MM.YYYY")}</p>
      <p className="flex md:hidden">{dayjs(entry.date).format("DD.MM")}</p>

      <p className="">{entry.workout_category_name}</p>

      {/* Workout Length */}
      <p>{entry.entry_type_id === 1 && convertTime(entry.length_in_minutes)}</p>

      {/* Intensity */}
      <p className="hidden md:flex">{entry.workout_intensity_name}</p>

      {/* Type of entry (sick, rest, ..) */}
      <p
        className={cc(
          "flex w-24 h-8 justify-center items-center rounded-md",
          entry.entry_type_id === 1 && "bg-bgExercise text-textExercise",
          entry.entry_type_id === 2 && "bg-bgRest text-textRest",
          entry.entry_type_id === 3 && "bg-bgSick text-textSick"
        )}
      >
        {entry.entry_type_name}
      </p>

      {/* Edit button only for student*/}
      <div className="flex justify-end md:justify-center">
        {user.role !== 1 && (
          <button
            onClick={() => openBigModal("edit", { entryId: entry.id })}
            className="text-iconGray hover:text-primaryColor"
          >
            <FiEdit3 size={20} />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="flex justify-around w-full col-span-5 gap-4 md:col-span-6">
          <p className="flex flex-col">
            <span className="text-textSecondary">Ajankohta:</span>
            {entry.time_of_day_name ? entry.time_of_day_name : "Ei ajankohtaa"}
          </p>
          <p className="flex flex-col">
            <span className="text-textSecondary">Harjoitus tyyppi:</span>
            {entry.workout_type_name ? entry.workout_type_name : "Ei tyyppiä"}
          </p>
          <p className="flex flex-col">
            <span className="text-textSecondary">Lisätiedot:</span>
            {entry.details ? entry.details : "Ei lisätietoja"}
          </p>
        </div>
      )}
    </div>
  );
};

////  const { data: journal } = useQuery({queryKey:['studentJournal']});

const RecentJournalEntries = ({ journal }) => {
  const { showDate } = useMainContext();
  const [filteredJournal, setFilteredJournal] = useState([]);
  const [selectedTime, setSelectedTime] = useState("Month");

  if (journal.journal_entries) journal = journal.journal_entries;

  useEffect(() => {
    if (journal) {
      const filteredJournal = journal.filter((entry) => {
        if (selectedTime === "Month") {
          return isSameMonth(showDate, new Date(entry.date), {
            weekStartsOn: 1,
          })
            ? entry
            : null;
        } else if (selectedTime === "Year") {
          return isSameYear(showDate, new Date(entry.date), {
            weekStartsOn: 1,
          })
            ? entry
            : null;
        } else {
          return entry;
        }
      });

      setFilteredJournal(filteredJournal);
    }
  }, [journal, selectedTime, showDate]);

  return (
    <div className="p-4 border rounded-md border-borderPrimary">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="IconBox">
            <FiBarChart2 />
          </p>
          <h2 className="text-lg font-medium">Omat merkinnät</h2>
        </div>
        <div>
          <select
            name="timeFilter"
            id="selectTimeFilter"
            className="p-2 border rounded-md bg-bgSecondary border-borderPrimary text-textSecondary hover:cursor-pointer focus-visible:outline-none focus:bg-bgPrimary hover:bg-bgPrimary"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            <option value="Month">Kuukausi</option>
            <option value="Year">Vuosi</option>
            <option value="AllTime">Kaikki</option>
          </select>
        </div>
      </div>
      <div className="flex h-full overflow-y-auto">
        <div className="relative w-full h-full rounded-md ">
          <div className="grid grid-cols-5 gap-4 p-2 border-b md:grid-cols-6 bg-bgGray text-textSecondary border-borderPrimary">
            <span className="hidden md:flex">Päivämäärä</span>
            <span className="flex md:hidden">Pvm</span>
            <span>Laji</span>
            <span>Kesto</span>
            <span className="hidden md:flex">Rankkuus</span>
            <span>Tyyppi</span>
            <span></span>
          </div>
          <div className="divide-y divide-borderPrimary flex flex-col h-full max-h-[240px] overflow-auto">
            {filteredJournal.length === 0 && (
              <p className="m-4 text-center text-textSecondary">
                Ei merkintöjä
              </p>
            )}
            {filteredJournal?.map((entry) => (
              <RecentJournalEntry key={entry.id} entry={entry} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentJournalEntries;

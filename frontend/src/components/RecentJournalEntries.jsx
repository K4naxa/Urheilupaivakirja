import { FiEdit3 } from "react-icons/fi";
import { useJournalModal } from "../hooks/useJournalModal";
import { useAuth } from "../hooks/useAuth";
import dayjs from "dayjs";
import cc from "../utils/cc";

import { FootballSoccerBall } from "@vectopus/atlas-icons-react";

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
  const { user } = useAuth();
  const { openBigModal } = useJournalModal();

  return (
    <div className="grid  grid-cols-6 gap-4 p-2 items-center">
      {/* Sport */}
      <div className="flex gap-2">
        <div className="bg-bgGray p-1 rounded-md ">
          {" "}
          <FootballSoccerBall size={20} className="text-headerPrimary" />
        </div>

        <p>{entry.workout_category}</p>
      </div>
      {/* Date */}
      <p>{dayjs(entry.date).format("DD.MM.YYYY")}</p>

      {/* WorkoutLenght */}
      <p>
        {" "}
        {entry.entry_type_id === 1 && convertTime(entry.length_in_minutes)}
      </p>
      {/* Intensity */}
      <p>{entry.intensity}</p>
      {/* Type of entry (sick, rest, ..) */}
      <p
        className={cc(
          "flex w-24 h-8 justify-center items-center rounded-md",
          entry.entry_type_id === 1 && "bg-btnGreen text-green-900",
          entry.entry_type_id === 2 && "bg-heatmapRest",
          entry.entry_type_id === 3 && "bg-heatmapSick"
        )}
      >
        {entry.entry_type}
      </p>
      {/* Edit button only for student*/}
      <p className="flex justify-center">
        {user.role !== 1 && (
          <button
            onClick={() => openBigModal("edit", { entryId: entry.id })}
            className="col-start-3 mx-4 justify-self-end"
          >
            <FiEdit3 />
          </button>
        )}
      </p>
    </div>
  );
};
////  const { data: journal } = useQuery({queryKey:['studentJournal']});

const RecentJournalEntries = ({ journal }) => {
  if (journal.journal_entries) journal = journal.journal_entries;
  if (journal.length === 0) {
    return (
      <div className=" flex max-h-[400px] w-full flex-col gap-2 md:max-h-[570px] ">
        <h2 className="text-lg">Viimeisimmät merkinnät</h2>
        <div
          className="flex w-full 
        flex-col gap-4 overflow-y-auto
        overscroll-none rounded-md scroll-smooth text-center bg-bgSecondary h-full"
        >
          Ei merkintöjä
        </div>
      </div>
    );
  } else
    return (
      <div className="flex w-full h-full flex-col overflow-y-auto rounded-md max-h-[300px] relative">
        <div className="sticky top-0 grid grid-cols-6 gap-4 p-2 bg-bgGray text-textSecondary border-b border-borderPrimary">
          <span>Laji</span>
          <span>Päivämäärä</span>
          <span>Kesto</span>
          <span>Rankkuus</span>
          <span>Tyyppi</span>
          <span></span>
        </div>
        <div className="divide-y divide-borderPrimary flex flex-col h-full">
          {" "}
          {journal.map((entry) => (
            <RecentJournalEntry key={entry.id} entry={entry} />
          ))}
        </div>
      </div>
    );
};

export default RecentJournalEntries;

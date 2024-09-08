import { FiBarChart2, FiEdit3 } from "react-icons/fi";
import { useBigModal } from "../hooks/useBigModal";
import { useAuth } from "../hooks/useAuth";
import dayjs from "dayjs";
import cc from "../utils/cc";

import { useMainContext } from "../hooks/mainContext";
import { useEffect, useState, useRef } from "react";
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

const RecentJournalEntry = ({ entry, user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { openBigModal } = useBigModal();

  console.log(user);
  return (
    <div className="hover:bg-hoverDefault bg-bgSecondary text-sm sm:text-base flex">
      <div
        className={`grid  w-[calc(100%-32px)] sm:w-[calc(100%-32px)] items-center px-1 py-2 sm:p-2 grid-cols-4 md:grid-cols-5 gap-0.5 md:gap-4 md:gap-y-0 ${
          isOpen ? "row-span-2" : ""
        }`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {/* Date */}
        <p className="hidden md:flex">
          {dayjs(entry.date).format("DD.MM.YYYY")}
        </p>
        <p className="flex md:hidden">{dayjs(entry.date).format("DD.MM")}</p>

        <p className="">
          {entry.workout_category_id === 1
            ? user?.sport
            : entry.workout_category_name}
        </p>

        {/* Workout Length */}
        <p>
          {entry.entry_type_id === 1 && convertTime(entry.length_in_minutes)}
        </p>

        {/* Intensity */}
        <p className="hidden md:flex">{entry.workout_intensity_name}</p>

        {/* Type of entry (sick, rest, ..) */}
        <div className="flex justify-between relative">
          <p
            className={cc(
              "flex min-w-20 h-8 justify-center items-center rounded-md px-1",
              entry.entry_type_id === 1 && "bg-bgExercise text-textExercise",
              entry.entry_type_id === 2 && "bg-bgRest text-textRest",
              entry.entry_type_id === 3 && "bg-bgSick text-textSick"
            )}
          >
            {entry.entry_type_name}
          </p>

          {user.role !== 1 && (
            <div
              className="flex-shrink-0 w-1 sm:ml-auto relative"
              // On smaller screens (`ml-2` keeps it close to the <p> element)
              // On larger screens (`ml-auto` pushes it as far to the right as possible)
            >
              <button
                onClick={(event) => {
                  event.stopPropagation();
                  openBigModal("editJournalEntry", { entryId: entry.id });
                }}
                className="absolute sm:right-[-28px] top-[6px] text-iconGray hover:text-primaryColor"
              >
                <FiEdit3 size={20} />
              </button>
            </div>
          )}
        </div>

        {isOpen && (
          <div className="flex justify-around w-full col-span-4 md:col-span-5 text-sm ">
            {entry.entry_type_id === 1 && (
              <>
                <p className="flex flex-col w-full pr-0.5 sm:pr-1 md:w-1/4">
                  <span className="text-textSecondary">Ajankohta:</span>
                  {entry.time_of_day_name
                    ? entry.time_of_day_name
                    : "Ei ajankohtaa"}
                </p>
                <p className="flex flex-col w-full pr-0.5 sm:pr-1 md:w-1/4">
                  <span className="text-textSecondary">Harjoitus tyyppi:</span>
                  {entry.workout_type_name
                    ? entry.workout_type_name
                    : "Ei tyyppiä"}
                </p>
              </>
            )}
            <p
              className={`flex flex-col w-full ${entry.entry_type_id === 1 ? "md:w-1/2" : "md:w-full"}`}
            >
              <span className="text-textSecondary">Lisätiedot:</span>
              <span className="whitespace-normal break-words">
                {entry.details ? entry.details : "Ei lisätietoja"}
              </span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

////  const { data: journal } = useQuery({queryKey:['studentJournal']});

const RecentJournalEntries = ({ journal }) => {
  const { showDate } = useMainContext();
  const [filteredJournal, setFilteredJournal] = useState([]);
  const [selectedTime, setSelectedTime] = useState("Month");
  const [scrollbarWidth, setScrollbarWidth] = useState(0);
  const scrollContainerRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    const element = scrollContainerRef.current;
    if (!element) return;

    const checkScrollbar = () => {
      const hasVerticalScrollbar = element.offsetWidth > element.clientWidth;
      const width = hasVerticalScrollbar
        ? element.offsetWidth - element.clientWidth
        : 0;
      setScrollbarWidth(width);
    };

    // Initialize the observer
    const observer = new MutationObserver(checkScrollbar);
    observer.observe(element, {
      childList: true, // observe direct children additions/removals
      subtree: true, // observe all descendants
      attributes: true, // observe attributes changes
      characterData: true, // observe text changes within children
    });

    // Perform initial check and setup resize listener
    checkScrollbar();
    window.addEventListener("resize", checkScrollbar);

    return () => {
      window.removeEventListener("resize", checkScrollbar);
      observer.disconnect(); // Clean up the observer when the component unmounts
    };
  }, []);

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
          <h2 className="text-lg">
            {user.role === 3 ? "Omat merkinnät" : "Merkinnät"}
          </h2>
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
          <div className="bg-bgGray text-textSecondary">
            <div
              style={{ paddingRight: `${8 + scrollbarWidth}px` }}
              className="grid grid-cols-4 px-1 py-2 w-[calc(100%-32px)] gap-1 md:gap-x-4 sm:pb-2 sm:pt-3 sm:px-2 border-b md:grid-cols-5 bg-bgGray text-textSecondary border-borderPrimary"
            >
              <span className="hidden md:flex">Päivämäärä</span>
              <span className="flex md:hidden">Pvm</span>
              <span>Laji</span>
              <span>Kesto</span>
              <span className="hidden md:flex">Rankkuus</span>
              <span>Tyyppi</span>
              <span></span>
            </div>
            <div
              ref={scrollContainerRef}
              className="divide-y divide-borderPrimary flex flex-col h-full max-h-[240px]  overflow-y-auto overflow-x-hidden"
            >
              {filteredJournal.length === 0 && (
                <div className="w-full h-full bg-bgSecondary">
                  <p className="m-4 text-center text-textSecondary">
                    Ei merkintöjä
                  </p>
                </div>
              )}
              {filteredJournal?.map((entry) => (
                <RecentJournalEntry key={entry.id} user={user} entry={entry} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecentJournalEntries;

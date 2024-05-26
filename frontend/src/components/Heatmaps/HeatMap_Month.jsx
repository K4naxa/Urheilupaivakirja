import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfMonth,
  startOfWeek,
  sub,
  subMonths,
} from "date-fns";
import { useMemo, useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import cc from "../../utils/cc";
import formatDate from "../../utils/formatDate";
import { useMainContext } from "../../hooks/mainContext";
import { Tooltip } from "react-tooltip";
import { useJournalModal } from "../../hooks/useJournalModal";
import {
  FiBookOpen,
  FiPlusCircle,
  FiEdit3,
  FiSun,
  FiSunrise,
  FiSunset,
  FiArrowLeft,
  FiChevronUp,
  FiChevronDown,
} from "react-icons/fi";
import dayjs from "dayjs";
import { useAuth } from "../../hooks/useAuth";
//import { FootballSoccerBall } from "@vectopus/atlas-icons-react";

function HeatMap_Month({ journal }) {
  const { showDate, setShowDate } = useMainContext();
  const [selectedDay, setSelectedDay] = useState(null);
  const { openBigModal } = useJournalModal();
  const { user } = useAuth();

  // create an array for the month
  const calendarDays = useMemo(() => {
    const firstWeekStart = startOfWeek(startOfMonth(showDate), {
      weekStartsOn: 1,
    });
    const lastWeekEnd = endOfWeek(endOfMonth(showDate));
    return eachDayOfInterval({ start: firstWeekStart, end: lastWeekEnd });
  }, [showDate]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setShowDate(startOfDay(subMonths(showDate, 1)));
    },
    onSwipedRight: () => {
      setShowDate(startOfDay(addMonths(showDate, 1)));
    },
  });

  const handleDayClick = (day) => {
    setSelectedDay(day);
  };

  return (
<<<<<<< Updated upstream
    <div
      {...handlers}
      className="MonthGrid max-w-[600px]  w-full h-full pt-6  gap-1"
    >
=======
    <div {...handlers} className="MonthGrid w-full h-full pt-6 gap-1">
      <Tooltip
        className="z-10 nice-shadow border border-borderPrimary"
        id="calendar-tooltip"
        place="bottom"
        openOnClick={true}
        clickable={true}
        opacity={1}
        offset="2"
        style={{
          backgroundColor: "rgb(var(--color-bg-secondary))",
          padding: "0.5rem",
        }}
      >
        {selectedDay && (
          <TooltipContent
            day={selectedDay}
            journal={journal}
            user={user}
            openBigModal={openBigModal}
          />
        )}
      </Tooltip>
>>>>>>> Stashed changes
      {calendarDays.map((day, index) => (
        <CalendarDay
          key={day.getTime()}
          day={day}
          journal={journal?.filter((journal) =>
            isSameDay(new Date(journal.date), day)
          )}
          showWeekName={index < 7}
          showDate={showDate}
          onClick={(event) => handleDayClick(day, event)}
        />
      ))}
    </div>
  );
}

const TooltipContent = ({ day, journal, user, openBigModal }) => {
  const [expandedEntry, setExpandedEntry] = useState(null);
  const dayEntries = journal?.filter((entry) =>
    isSameDay(new Date(entry.date), day)
  );

  const simulateClickOutside = () => {
    const benignElement = document.getElementById("benign-target");
    const clickEvent = new MouseEvent("click", {
      view: window,
      bubbles: true,
      cancelable: true,
    });

    if (benignElement) {
      benignElement.dispatchEvent(clickEvent);
    } else {
      console.error("Where is the benign-target element?");
    }
  };

  const renderTimeOfDayIcon = (timeOfDay) => {
    switch (timeOfDay) {
      case "Aamu":
        return <FiSunrise className="text-lg" title="Aamu" />;
      case "Päivä":
        return <FiSun className="text-lg" title="Päivä" />;
      case "Ilta":
        return <FiSunset className="text-lg" title="Ilta" />;
      default:
        return null;
    }
  };

  const renderIntensity = (intensity) => {
    switch (intensity) {
      case 1:
        return "Kevyt";
      case 2:
        return "Normaali";
      case 3:
        return "Rankka";
      default:
        return "";
    }
  };

  const allEntriesAreExercises = dayEntries?.every(
    (entry) => entry.entry_type_id === 1
  );

  const toggleDetails = (entryId) => {
    if (expandedEntry === entryId) {
      setExpandedEntry(null); // Close if already open
    } else {
      setExpandedEntry(entryId); // Expand new entry
    }
  };

  return (
    <>
      <div className="flex text-textPrimary flex-col gap-1">
        <h2 className="text-sm  text-center font-semibold my-0.5">
          {dayjs(day).format("DD.MM.YYYY")}
        </h2>

        {dayEntries?.length > 0 && (
          <>
            {allEntriesAreExercises ? (
              <table className="w-full text-right text-textPrimary">
                <tbody>
                  {dayEntries.map((entry) => (
                    <>
                      <tr
                        key={entry.id}
                        className="hover:bg-bgkPrimary cursor-pointer"
                        onClick={() => toggleDetails(entry.id)}
                      >
                        <td className="flex justify-center px-2">
                          {renderTimeOfDayIcon(entry.time_of_day)}
                        </td>
                        <td className="px-2">{entry.workout_category}</td>
                        <td className="flex justify-center px-2">
                          {renderIntensity(entry.intensity)}
                        </td>
                        <td className="px-2">{entry.length_in_minutes} min</td>
                        {user.role === 3 && (
                          <td className="px-2">
                            <button
                              className="flex justify-center"
                              onClick={(e) => {
                                e.stopPropagation(); // Prevent row toggle
                                openBigModal("edit", { entryId: entry.id });
                                simulateClickOutside();
                              }}
                            >
                              <FiEdit3 className="text-textPrimary" />
                            </button>
                          </td>
                        )}
                      </tr>
                      {expandedEntry === entry.id && (
                        <tr>
                          <td colSpan={5}>
                            {/* Render expanded content here */}
                            <div>
                              {/* Example content */}
                              <p>Tähän sit kai jotain joo-o...</p>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            ) : (
              dayEntries.map((entry) => (
                <div key={entry.id} className="text-center">
                  <p>
                    {entry.entry_type_id === 3
                      ? "Sairauspäivä"
                      : entry.entry_type_id === 2
                        ? "Lepopäivä"
                        : "Jotain meni vikaan!"}
                  </p>
                </div>
              ))
            )}
          </>
        )}

        <div className="flex justify-center gap-2 py-1">
          {dayEntries?.length > 0 ? (
            allEntriesAreExercises ? (
              <>
                <button
                  className=" px-4 py-2 bg-headerPrimary text-white rounded cursor-pointer flex items-center"
                  onClick={() => openBigModal("show", { date: day })}
                >
                  <FiBookOpen className="text-xl" />
                  <p className="ml-2 text-sm">Näytä</p>
                </button>
                <button
                  className=" px-4 py-2 bg-headerPrimary text-white rounded cursor-pointer flex items-center"
                  onClick={() => {
                    openBigModal("new", {
                      date: dayjs(day).format("YYYY-MM-DD"),
                    });
                    simulateClickOutside();
                  }}
                >
                  <FiPlusCircle className="text-xl" />
                  <p className="ml-2 text-sm">Uusi merkintä</p>
                </button>
              </>
            ) : (
              <button
                className=" px-4 py-2 bg-headerPrimary text-white rounded cursor-pointer flex items-center"
                onClick={() => {
                  openBigModal("edit", { entryId: dayEntries[0].id });
                  simulateClickOutside();
                }}
              >
                <FiEdit3 className="text-xl" />
                <p className="ml-2 text-sm">Muokkaa</p>
              </button>
            )
          ) : (
            <button
              className=" px-4 py-2 bg-headerPrimary text-white rounded cursor-pointer flex items-center"
              onClick={() => {
                openBigModal("new", { date: dayjs(day).format("YYYY-MM-DD") });
                simulateClickOutside();
              }}
            >
              <FiPlusCircle className="text-xl" />
              <p className="ml-2 text-sm">Uusi merkintä</p>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

function CalendarDay({ day, showWeekName, journal, showDate, onClick }) {
  let minutes = 0;
  journal?.map((entry) => (minutes += entry.length_in_minutes));

  function handleColor(minutes) {
    if (!isSameMonth(day, showDate)) return;
    if (!journal) return;

    if (minutes > 1 && minutes <= 60)
      return "bg-heatmapExercise1 border-heatmapExercise1 text-textExercise";
    if (minutes > 60 && minutes <= 120)
      return "bg-heatmapExercise2 border-heatmapExercise2 text-textExercise";
    if (minutes > 120)
<<<<<<< Updated upstream
      return "bg-heatmapExercise3 border-heatmapExercise3  text-textExercise";
=======
      return "bg-heatmapExercise3 border-heatmapExercise3 text-white";
>>>>>>> Stashed changes

    if (journal[0]?.entry_type_id === 2)
      return "bg-bgRest border-bgRest text-textRest";
    if (journal[0]?.entry_type_id === 3)
      return "bg-bgSick border-bgSick text-textSick";

    return null;
  }

  return (
    <div
      data-tooltip-id="calendar-tooltip"
      className={cc(
        "MonthDate relative border",
        !isSameMonth(day, showDate) && "invisible",
<<<<<<< Updated upstream
        // user.role === 1 && "bg-bgPrimary border-bgPrimary",
        isToday(day) && "border  border-primaryColor",
=======
        isToday(day) && "border border-headerPrimary",
>>>>>>> Stashed changes
        handleColor(minutes)
      )}
      onClick={onClick}
    >
      {showWeekName && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-textSecondary visible text-xs">
          {formatDate(day, { weekday: "short" })}
        </div>
      )}

      {isSameMonth(day, showDate) && formatDate(day, { day: "numeric" })}
    </div>
  );
}

export default HeatMap_Month;

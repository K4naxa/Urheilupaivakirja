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
  subMonths,
} from "date-fns";
import { useMemo } from "react";
import { useSwipeable } from "react-swipeable";
import cc from "../../utils/cc";
import formatDate from "../../utils/formatDate";
import { useMainContext } from "../../hooks/mainContext";
import { useHeatmapContext } from "../../hooks/useHeatmapContext";

//import { FootballSoccerBall } from "@vectopus/atlas-icons-react";

function HeatMap_Month({ journal }) {
  const { showDate, setShowDate } = useMainContext();
  const { setTooltipContent, setTooltipUser, setTooltipDate } =
    useHeatmapContext();
  if (journal.journal_entries) journal = journal.journal_entries;

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
      setShowDate(startOfDay(addMonths(showDate, 1)));
    },
    onSwipedRight: () => {
      setShowDate(startOfDay(subMonths(showDate, 1)));
    },
  });

  const handleClick = (dayJournal, day) => {
    setTooltipDate(day);
    setTooltipContent(dayJournal);
  };

  return (
    <div
      {...handlers}
      className="MonthGrid max-w-[600px] w-full h-full pt-6 gap-1"
    >
      {calendarDays.map((day, index) => {
        const dayJournal = journal?.filter((journalEntry) => {
          const journalDate = new Date(journalEntry.date);
          return (
            journalDate.getDate() === day.getDate() &&
            journalDate.getMonth() === day.getMonth() &&
            journalDate.getFullYear() === day.getFullYear()
          );
        });
        return (
          <CalendarDay
            key={day.getTime()}
            day={day}
            showWeekName={index < 7}
            showDate={showDate}
            journal={dayJournal}
            onClick={() => handleClick(dayJournal, day)}
          />
        );
      })}
    </div>
  );
}

function CalendarDay({ day, showWeekName, journal, showDate, onClick }) {
  const minutes = useMemo(
    () => journal?.reduce((acc, entry) => acc + entry.length_in_minutes, 0),
    [journal]
  );
  const memoizedColor = useMemo(
    () => handleColor(minutes),
    [day, journal, minutes]
  );


  function handleColor(minutes) {
    if (!isSameMonth(day, showDate)) return;
    if (!journal) return;

    if (minutes > 1 && minutes <= 60)
      return "bg-heatmapExercise1 border-heatmapExercise2 text-black";
    if (minutes > 60 && minutes <= 120)
      return "bg-heatmapExercise2 border-heatmapExercise3 text-black";
      if (minutes > 120 && minutes <= 180)
      return "bg-heatmapExercise3 border-heatmapExercise4 text-white";
    if (minutes > 180)
      return "bg-heatmapExercise4 border-heatmapExercise5 text-white";

    if (journal[0]?.entry_type_id === 2)
      return "bg-bgRest border-borderRest text-black";
    if (journal[0]?.entry_type_id === 3)
      return "bg-bgSick border-borderSick text-black";

    return null;
  }

  return (
    <div
      /*data-tooltip-id={`calendar-tooltip-${identifier}`}*/
      className={cc(
        "MonthDate border-borderPrimary border clickableCalendarDay relative",
        !isSameMonth(day, showDate) && "invisible",
        isToday(day) && "border  border-primaryColor",
        memoizedColor
      )}
      onClick={onClick}
    >
      {showWeekName && (
        <div className="absolute visible text-xs transform -translate-x-1/2 -top-6 left-1/2 text-textSecondary">
          {formatDate(day, { weekday: "short" })}
        </div>
      )}

      {isSameMonth(day, showDate) && formatDate(day, { day: "numeric" })}
    </div>
  );
}

export default HeatMap_Month;

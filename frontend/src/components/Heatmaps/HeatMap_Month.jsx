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

function HeatMap_Month({ journal }) {
  const { showDate, setShowDate } = useMainContext();

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
      setShowDate(startOfDay(subMonths(showDate, 1)));
    },
    onSwipedRight: () => {
      setShowDate(startOfDay(addMonths(showDate, 1)));
    },
  });

  return (
    <div
      {...handlers}
      className="MonthGrid max-w-[600px]  w-full h-full pt-6  gap-1"
    >
      {calendarDays.map((day, index) => (
        <CalendarDay
          key={day.getTime()}
          day={day}
          journal={journal?.filter((journal) => isSameDay(journal.date, day))}
          showWeekName={index < 7}
          showDate={showDate}
        />
      ))}
    </div>
  );
}
function CalendarDay({ day, showWeekName, journal, showDate }) {
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
      return "bg-heatmapExercise3 border-heatmapExercise3  text-textExercise";

    if (journal[0]?.entry_type_id === 2)
      return "bg-bgRest border-bgRest text-textRest";
    if (journal[0]?.entry_type_id === 3)
      return "bg-bgSick border-bgSick text-textSick";

    return null;
  }

  return (
    <div
      className={cc(
        "MonthDate border border-borderPrimary",
        !isSameMonth(day, showDate) && "invisible",
        isToday(day) && "border  border-primaryColor",
        handleColor(minutes)
      )}
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

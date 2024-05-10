import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { useMemo } from "react";

import cc from "../../utils/cc";
import formatDate from "../../utils/formatDate";
import { useMainContext } from "../../hooks/mainContext";

function HeatMap_Month({ journal }) {
  const { showDate } = useMainContext();

  // create an array for the month
  const calendarDays = useMemo(() => {
    const firstWeekStart = startOfWeek(startOfMonth(showDate), {
      weekStartsOn: 1,
    });
    const lastWeekEnd = endOfWeek(endOfMonth(showDate));
    return eachDayOfInterval({ start: firstWeekStart, end: lastWeekEnd });
  }, [showDate]);

  return (
    <div className="MonthGrid   w-full h-full max-w-96  gap-1 p-8">
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

    if (minutes > 30 && minutes <= 60)
      return "bg-heatmapExercise1 border-heatmapExercise1";
    if (minutes > 60 && minutes <= 120)
      return "bg-heatmapExercise2 border-heatmapExercise2 text-white";
    if (minutes > 120)
      return "bg-heatmapExercise3 border-heatmapExercise3  text-white";

    if (journal[0]?.entry_type_id === 2)
      return "bg-heatmapRest border-heatmapRest text-white";
    if (journal[0]?.entry_type_id === 3)
      return "bg-heatmapSick border-heatmapSick text-white";

    return null;
  }

  return (
    <div
      className={cc(
        "MonthDate relative border",
        !isSameMonth(day, showDate) && "bg-bgPrimary hover:border-none",
        isToday(day) && "border  border-headerPrimary",
        handleColor(minutes)
      )}
    >
      {showWeekName && (
        <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-textSecondary text-xs">
          {formatDate(day, { weekday: "short" })}
        </div>
      )}

      {isSameMonth(day, showDate) && formatDate(day, { day: "numeric" })}
    </div>
  );
}
export default HeatMap_Month;

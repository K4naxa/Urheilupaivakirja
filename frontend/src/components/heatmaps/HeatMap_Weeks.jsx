import { useMemo } from "react";
import {
  addWeeks,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfDay,
  endOfWeek,
  isToday,
  startOfDay,
  startOfWeek,
} from "date-fns";
import cc from "../../utils/cc";
import formatDate from "../../utils/formatDate";
import { useAuth } from "../../hooks/useAuth";
import { useHeatmapContext } from "../../hooks/useHeatmapContext";

function HeatMap_Weeks({ journal, showDate }) {
  const { setTooltipContent, setTooltipDate } = useHeatmapContext();
  if (journal.journal_entries) journal = journal.journal_entries;

  let calendarWeeks = useMemo(() => {
    const firstWeekStart = startOfWeek(showDate); // start from 2 weeks ago
    const lastWeekEnd = endOfWeek(addWeeks(showDate, 1));
    return eachWeekOfInterval({ start: firstWeekStart, end: lastWeekEnd });
  }, [showDate]);

  let calendar = useMemo(() => {
    let newCalendar = [];

    calendarWeeks.forEach((week) => {
      const startOfWeekDay = startOfDay(startOfWeek(week, { weekStartsOn: 1 }));
      const endOfWeekDay = endOfDay(endOfWeek(week, { weekStartsOn: 1 }));
      const daysInWeek = eachDayOfInterval({
        start: startOfWeekDay,
        end: endOfWeekDay,
      });
      newCalendar.push(daysInWeek);
    });

    return newCalendar;
  }, [calendarWeeks]);

  const handleClick = (dayJournal, day) => {
    setTooltipDate(day);
    setTooltipContent(dayJournal);
  };

  return (
    <div className="grid grid-cols-2 gap-4">
      {calendar.map((week, index) => (
        <div key={index}>
          <div className="grid grid-cols-7 gap-1">
            {week.map((day) => {
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
                  showDate={showDate}
                  journal={dayJournal}
                  onClick={() => handleClick(dayJournal, day)}
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
function CalendarDay({ day, journal, onClick }) {
  const { user } = useAuth();
  const minutes = useMemo(
    () => journal?.reduce((acc, entry) => acc + entry.length_in_minutes, 0),
    [journal]
  );
  const memoizedColor = useMemo(
    () => handleColor(minutes),
    [day, journal, minutes]
  );

  function handleColor(minutes) {
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
      className={cc(
        "MonthDate border-borderPrimary border w-full clickableCalendarDay",
        user.role === 1 && "bg-bgPrimary border-bgPrimary",
        isToday(day) && "border  border-primaryColor",
        memoizedColor
      )}
      onClick={onClick}
    >
      {formatDate(day, { day: "numeric" })}
    </div>
  );
}

export default HeatMap_Weeks;

import { useMemo } from "react";
import {
  addWeeks,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfDay,
  endOfWeek,
  isSameDay,
  isToday,
  startOfDay,
  startOfWeek,
} from "date-fns";
import cc from "../../utils/cc";
import formatDate from "../../utils/formatDate";
import { useMainContext } from "../../hooks/mainContext";
import { useAuth } from "../../hooks/useAuth";

export default function HeatMap_Weeks({ journal }) {
  const { showDate } = useMainContext();
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

  return (
    <div className="grid grid-cols-2 gap-4">
      {calendar.map((week, index) => (
        <div key={index}>
          <div className="grid grid-cols-7 gap-1">
            {week.map((day) => (
              <CalendarDay
                key={day.getTime()}
                day={day}
                showDate={showDate}
                journal={journal?.filter((journal) =>
                  isSameDay(journal.date, day)
                )}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  function CalendarDay({ day, journal }) {
    const { user } = useAuth();
    let minutes = 0;
    journal?.forEach((entry) => (minutes += entry.length_in_minutes));

    function handleColor(minutes) {
      if (!journal) return;

      if (minutes > 1 && minutes <= 60)
        return "bg-heatmapExercise1 border-heatmapExercise1";
      if (minutes > 60 && minutes <= 120)
        return "bg-heatmapExercise2 border-heatmapExercise2 text-white";
      if (minutes > 120)
        return "bg-heatmapExercise3 border-heatmapExercise3  text-white";

      if (journal[0]?.entry_type_id === 2)
        return "bg-bgRest border-bgRest text-white";
      if (journal[0]?.entry_type_id === 3)
        return "bg-bgSick border-bgSick text-white";

      return null;
    }

    return (
      <div
        className={cc(
          "MonthDate relative border w-5 lg:w-7",
          user.role === 1 && "bg-bgPrimary border-bgPrimary",
          isToday(day) && "border  border-primaryColor",
          handleColor(minutes)
        )}
      >
        {formatDate(day, { day: "numeric" })}
      </div>
    );
  }
}

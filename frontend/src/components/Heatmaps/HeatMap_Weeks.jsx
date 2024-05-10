import React, { useMemo } from "react";
import {
  addWeeks,
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfDay,
  endOfWeek,
  isSameDay,
  isSameMonth,
  isToday,
  startOfDay,
  startOfWeek,
  subWeeks,
} from "date-fns";
import cc from "../../utils/cc";
import formatDate from "../../utils/formatDate";
import { useMainContext } from "../../hooks/mainContext";

export default function HeatMap_Weeks({ journal }) {
  const { showDate } = useMainContext();

  let calendarWeeks = useMemo(() => {
    const firstWeekStart = startOfWeek(subWeeks(showDate, 1)); // start from 2 weeks ago
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

  console.log(calendar);
  return (
    <div className="px-2">
      <div className="grid grid-cols-3 gap-2">
        {calendar.map((week, index) => (
          <div key={index}>
            <div className="grid grid-cols-7 max-w-60 gap-1">
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
            <div className="text-xs text-secondary">
              {formatDate(week[0], { month: "long" })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  function CalendarDay({ day, journal }) {
    let minutes = 0;
    journal?.forEach((entry) => (minutes += entry.length_in_minutes));

    function handleColor(minutes) {
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
          isToday(day) && "border  border-headerPrimary",
          handleColor(minutes)
        )}
      >
        {formatDate(day, { day: "numeric" })}
      </div>
    );
  }
}

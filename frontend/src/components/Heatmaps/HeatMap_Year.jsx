import { useMemo } from "react";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  isSameDay,
  isSameMonth,
  isSameYear,
  isToday,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";

import cc from "../../utils/cc";
import formatDate from "../../utils/formatDate";
import { useMainContext } from "../../hooks/mainContext";

export default function HeatMap_Year({ journal }) {
  const { showDate } = useMainContext();

  const calendaryYear = useMemo(() => {
    const firstMonthStart = startOfMonth(startOfYear(showDate));
    const lastMonthEnd = endOfMonth(endOfYear(showDate));
    return eachMonthOfInterval({ start: firstMonthStart, end: lastMonthEnd });
  }, [showDate]);

  const calendarMonths = useMemo(() => {
    let days = [];
    calendaryYear.forEach((month) => {
      const firstWeekStart = startOfWeek(startOfMonth(month), {
        weekStartsOn: 1,
      });
      const lastWeekEnd = endOfMonth(month);
      days.push(eachDayOfInterval({ start: firstWeekStart, end: lastWeekEnd }));
    });
    return days;
  }, [calendaryYear]);

  console.log(calendaryYear);
  console.log(calendarMonths);

  return (
    <div className="YearGrid p-4 overflow-x-auto">
      {calendarMonths.map((month, index) => {
        return (
          <div key={month[index].getTime()}>
            <div className="text-center text-xs text-textSecondary">
              {formatDate(month[index], { month: "long" })}
            </div>
            <div className="YearMonthGrid gap-[2px] lg:gap-1">
              {month.map((day) => {
                return (
                  <CalendarDay
                    key={day.getTime()}
                    day={day}
                    journal={journal?.filter((journal) =>
                      isSameDay(journal.date, day)
                    )}
                    month={month}
                    showDate={showDate}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CalendarDay({ day, journal, month, showDate }) {
  console.log(journal);
  let minutes = 0;
  journal?.map((entry) => (minutes += entry.length_in_minutes));

  function handleColor(minutes) {
    if (!isSameMonth(day, month[10])) return;
    if (!isSameYear(day, showDate)) return;
    if (!journal) return;

    if (minutes > 30 && minutes <= 60)
      return "bg-heatmapExercise1 border-heatmapExercise1";
    if (minutes > 60 && minutes <= 120)
      return "bg-heatmapExercise2 text-white border-heatmapExercise2";
    if (minutes > 120)
      return "bg-heatmapExercise3 text-white border-heatmapExercise3";

    if (journal[0]?.entry_type_id === 2)
      return "bg-heatmapRest text-white border-heatmapRest";
    if (journal[0]?.entry_type_id === 3)
      return "bg-heatmapSick text-white border-heatmapSick";

    return null;
  }

  return (
    <div
      className={cc(
        "YearDate border relative rounded-sm hover:border-headerPrimary",
        !isSameMonth(day, month[10]) && "invisible",
        isToday(day) && "border-headerPrimary",
        handleColor(minutes)
      )}
    ></div>
  );
}

import { useMemo } from "react";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
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
import { useHeatmapContext } from "../../hooks/useHeatmapContext";

export default function HeatMap_Year({ journal }) {
  if (journal.journal_entries) journal = journal.journal_entries;
  const { setTooltipContent, setTooltipUser, setTooltipDate } = useHeatmapContext();

  const { showDate } = useMainContext();
  

  const calendaryYear = useMemo(() => {
    const firstMonthStart = startOfMonth(startOfYear(showDate));
    const lastMonthEnd = endOfMonth(endOfYear(showDate));
    return eachMonthOfInterval({ start: firstMonthStart, end: lastMonthEnd });
  }, [showDate]);

  const calendarMonths = useMemo(() => {
    const months = [];
    calendaryYear.forEach((month) => {
      const daysOfMonth = eachDayOfInterval({
        start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
        end: endOfMonth(month),
      });
      months.push(daysOfMonth);
    });
    return months;
  }, [calendaryYear]);

  const handleClick = (day) => {
    const dayEntries = journal.filter(entry => 
      isSameDay(new Date(entry.date), day)
    );
    setTooltipDate(day);
    setTooltipContent(dayEntries);
  };

  return (
    <div className="YearGrid overflow-x-auto gap-1 pb-2">
      {calendarMonths.map((month) => {
        // Get the 5th day of the month
        const fifthDayOfMonth = month.find((day) => day.getDate() === 5);

        return (
          <div key={fifthDayOfMonth.getTime()}>
            <div className="text-center text-xs text-textSecondary">
              {formatDate(fifthDayOfMonth, { month: "long" })}
            </div>
            <div className="relative YearMonthGrid gap-[2px]">
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
                    onClick={() => handleClick(day)}
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

function CalendarDay({ day, journal, month, showDate, onClick }) {
  let minutes = 0;
  journal?.map((entry) => (minutes += entry.length_in_minutes));

  function handleColor(minutes) {
    if (!isSameMonth(day, month[10])) return;
    if (!isSameYear(day, showDate)) return;
    if (!journal) return;

    if (minutes > 1 && minutes <= 60)
      return "bg-heatmapExercise1 border-heatmapExercise1";
    if (minutes > 60 && minutes <= 120)
      return "bg-heatmapExercise2 text-white border-heatmapExercise2";
    if (minutes > 120)
      return "bg-heatmapExercise3 text-white border-heatmapExercise3";

    if (journal[0]?.entry_type_id === 2)
      return "bg-bgRest text-white border-bgRest";
    if (journal[0]?.entry_type_id === 3)
      return "bg-bgSick text-white border-bgSick";

    return null;
  }

  return (
    <div
      className={cc(
        "YearDate clickableCalendarDay border relative rounded-sm hover:border-primaryColor",
        !isSameMonth(day, month[10]) && "invisible",
        isToday(day) && "border-primaryColor",
        handleColor(minutes)
      )}
      onClick={onClick}
    ></div>
  );
}

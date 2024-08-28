import { useMemo, useCallback } from "react";
import {
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  endOfYear,
  format,
  isSameMonth,
  isSameYear,
  isToday,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import cc from "../../utils/cc";
import formatDate from "../../utils/formatDate";
import { useHeatmapContext } from "../../hooks/useHeatmapContext";

export default function HeatMap_Year({ journal, showDate }) {
  if (journal.journal_entries) journal = journal.journal_entries;

  const { setTooltipContent, setTooltipDate } = useHeatmapContext();

  const journalMap = useMemo(() => {
    const map = new Map();
    journal.forEach((journalEntry) => {
      const dateStr = format(new Date(journalEntry.date), "yyyy-MM-dd");
      if (!map.has(dateStr)) {
        map.set(dateStr, []);
      }
      map.get(dateStr).push(journalEntry);
    });
    return map;
  }, [journal]);

  const calendaryYear = useMemo(() => {
    const firstMonthStart = startOfMonth(startOfYear(showDate));
    const lastMonthEnd = endOfMonth(endOfYear(showDate));
    return eachMonthOfInterval({ start: firstMonthStart, end: lastMonthEnd });
  }, [showDate]);

  const calendarMonths = useMemo(() => {
    return calendaryYear.map((month) => {
      return eachDayOfInterval({
        start: startOfWeek(startOfMonth(month), { weekStartsOn: 1 }),
        end: endOfMonth(month),
      });
    });
  }, [calendaryYear]);

  const handleClick = (dayJournal, day) => {
    setTooltipDate(day);
    setTooltipContent(dayJournal);
  };

  const MemoizedCalendarDay = useCallback(CalendarDay, []);

  return (
    <div className="gap-1 pb-2 overflow-x-auto YearGrid">
      {calendarMonths.map((month) => {
        // Get the 5th day of the month
        const fifthDayOfMonth = month.find((day) => day.getDate() === 5);

        return (
          <div key={fifthDayOfMonth.getTime()}>
            <div className="text-xs text-center text-textSecondary">
              {formatDate(fifthDayOfMonth, { month: "long" })}
            </div>
            <div className=" YearMonthGrid gap-[2px]">
              {month.map((day) => {
                const dayStr = format(day, "yyyy-MM-dd");
                const dayJournal = journalMap.get(dayStr) || [];

                return (
                  <MemoizedCalendarDay
                    key={day.getTime()}
                    day={day}
                    journal={dayJournal}
                    month={month}
                    showDate={showDate}
                    onClick={() => handleClick(dayJournal, day)}
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
  const minutes = useMemo(
    () => journal?.reduce((acc, entry) => acc + entry.length_in_minutes, 0),
    [journal]
  );
  const memoizedColor = useMemo(
    () => handleColor(minutes),
    [day, journal, minutes]
  );

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
        "YearDate border rounded-sm hover:border-primaryColor clickableCalendarDay",
        !isSameMonth(day, month[10]) && "invisible",
        isToday(day) && "border-primaryColor",
        memoizedColor
      )}
      onClick={onClick}
    ></div>
  );
}
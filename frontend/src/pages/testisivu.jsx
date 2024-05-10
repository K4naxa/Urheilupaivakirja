import { useMemo } from "react";
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { IconContext } from "react-icons/lib";

import HeatMap_Month from "../components/HeatMap_Month";
import trainingService from "../services/trainingService";
import formatDate from "../utils/formatDate";
import { cc } from "../utils/cc";
import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";

import { useQuery } from "@tanstack/react-query";

import { useMainContext } from "../hooks/mainContext";

function Testisivu() {
  const { showDate, setShowDate } = useMainContext();
  const { data: studentJournalData } = useQuery({
    queryKey: ["studentJournal"],
    queryFn: () => trainingService.getAllUserJournalEntries(),
    staleTime: 15 * 60 * 1000, // = 15 minutes in milliseconds - how long to use the cached data before re-fetching
  });

  return (
    <div className="flex flex-col max-w-96 w-full gap-1">
      <div className="flex w-full flex-col text-center">
        <h2 className="text-textSecondary">{showDate.getFullYear()}</h2>
        <div className="hover: flex justify-center gap-4">
          <button
            className="hover:underline"
            onClick={() => {
              // Subtract one month from the current showDate
              const previousMonth = new Date(showDate);
              previousMonth.setMonth(previousMonth.getMonth() - 1);
              setShowDate(previousMonth); // Update showDate
            }}
          >
            <IconContext.Provider
              value={{ className: "hover:text-graphPrimary" }}
            >
              <FiChevronLeft />
            </IconContext.Provider>
          </button>
          <p className="text-xl w-24">
            {formatDate(showDate, { month: "long" })}
          </p>
          <button
            className="hover:fill-blue-500 hover:underline"
            onClick={() => {
              // Subtract one month from the current showDate
              const previousMonth = new Date(showDate);
              previousMonth.setMonth(previousMonth.getMonth() + 1);
              setShowDate(previousMonth); // Update showDate
            }}
          >
            <IconContext.Provider
              value={{ className: "hover:text-graphPrimary" }}
            >
              <FiChevronRight />
            </IconContext.Provider>
          </button>
        </div>
      </div>
      <div>
        <MonthCalendar journal={studentJournalData} />
        {/* <HeatMap_Month journal={studentJournalData} /> */}
      </div>
    </div>
  );
}

function MonthCalendar({ journal }) {
  const { showDate } = useMainContext();

  // create an array for the month
  const calendarDays = useMemo(() => {
    const firstWeekStart = startOfWeek(startOfMonth(showDate), {
      weekStartsOn: 1,
    });
    const lastWeekEnd = endOfWeek(endOfMonth(showDate));
    let days = eachDayOfInterval({ start: firstWeekStart, end: lastWeekEnd });
    console.log(journal);
    return days;
  }, [showDate, journal]);

  return (
    <div className="MonthGrid   w-full h-full  gap-1 p-8">
      {calendarDays.map((day, index) => (
        <CalendarDay
          key={day.getTime()}
          day={day}
          showWeekName={index < 7}
          showDate={showDate}
        />
      ))}
    </div>
  );
}

function CalendarDay({ day, showWeekName, showDate }) {
  return (
    <div
      className={cc(
        "MonthDate relative",
        !isSameMonth(day, showDate) && "bg-bgPrimary ",
        isToday(day) && "border  border-headerPrimary"
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

export default Testisivu;

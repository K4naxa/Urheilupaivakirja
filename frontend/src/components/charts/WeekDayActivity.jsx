import { useEffect, useState } from "react";
import { FiBarChart } from "react-icons/fi";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useMainContext } from "../../hooks/mainContext";
import {
  isSameMonth,
  isSameWeek,
  isSameYear,
  getDay,
  eachWeekOfInterval,
  startOfMonth,
  endOfMonth,
  getWeek,
  startOfYear,
  endOfYear,
  eachMonthOfInterval,
  startOfWeek,
  endOfWeek,
  eachYearOfInterval,
  endOfDay,
} from "date-fns";
import formatDate from "../../utils/formatDate";

function WeekDayActivity({ journal }) {
  const { showDate } = useMainContext();
  const [selectedTime, setSelectedTime] = useState("Month");
  const [selectedView, setSelectedView] = useState("Day");
  const [data, setData] = useState([]);

  // Ensure the selected view is compatible with the selected time
  useEffect(() => {
    if (
      selectedTime === "Month" &&
      selectedView !== "Day" &&
      selectedView !== "Week"
    )
      setSelectedView("Week");

    if (selectedTime === "Year" && selectedView === "Year")
      setSelectedView("Month");
  }, [selectedTime, selectedView]);

  // Filter the journal entries based on the selectedTime and selectedView
  useEffect(() => {
    // If journal is not fetched yet, return
    if (!journal) return;

    let newData = [];

    // Filter the journal entries based on the selectedTime
    const filteredJournal = journal.filter((entry) => {
      if (selectedTime === "Month") {
        return isSameMonth(showDate, new Date(entry.date), {
          weekStartsOn: 1,
        });
      } else if (selectedTime === "Year") {
        return isSameYear(showDate, new Date(entry.date), {
          weekStartsOn: 1,
        });
      } else {
        return entry;
      }
    });

    // Render the data based on the selectedView
    if (selectedView === "Day") {
      newData = [
        { date: "Ma", hours: 0 },
        { date: "Ti", hours: 0 },
        { date: "Ke", hours: 0 },
        { date: "To", hours: 0 },
        { date: "Pe", hours: 0 },
        { date: "La", hours: 0 },
        { date: "Su", hours: 0 },
      ];
      filteredJournal.forEach((entry) => {
        // get the day of the week, 0 = sunday, days converted to 0 = monday
        const date = new Date(entry.date);
        let day = getDay(date);
        if (day === 0) day = 7;
        day -= 1;
        newData[day].hours += entry.length_in_minutes / 60;
      });
      setData(newData);
    }

    if (selectedView === "Week") {
      newData = [];
      // Get Renderable Weeks depending on the selectedTime
      let calendarWeeks = () => {
        if (selectedTime === "Month") {
          const firstWeekStart = startOfWeek(startOfMonth(showDate), {
            weekStartsOn: 1,
          });
          const lastWeekEnd = endOfWeek(endOfMonth(endOfDay(showDate)), {
            weekStartsOn: 1,
          });
          return eachWeekOfInterval(
            {
              start: firstWeekStart,
              end: lastWeekEnd,
            },
            { weekStartsOn: 1 }
          );
        } else if (selectedTime === "Year") {
          const firstWeekStart = startOfWeek(startOfYear(showDate));
          const lastWeekEnd = endOfWeek(endOfYear(showDate));
          return eachWeekOfInterval(
            {
              start: firstWeekStart,
              end: lastWeekEnd,
            },
            { weekStartsOn: 1 }
          );
        } else if (selectedTime === "AllTime") {
          const firstWeekStart = startOfWeek(
            new Date(journal[journal.length - 1].date)
          );
          const lastWeekEnd = endOfWeek(new Date(journal[0].date));
          return eachWeekOfInterval(
            {
              start: firstWeekStart,
              end: lastWeekEnd,
            },
            { weekStartsOn: 1 }
          );
        }
      };

      calendarWeeks().forEach((week) => {
        let totalHours = 0;
        filteredJournal.forEach((entry) => {
          if (isSameWeek(new Date(entry.date), week, { weekStartsOn: 1 })) {
            totalHours += entry.length_in_minutes / 60;
          }
        });
        newData.push({
          date: getWeek(week),
          hours: totalHours,
        });
      });
      setData(newData);
    }

    if (selectedView === "Month") {
      newData = [];
      // Get Renderable Months depending on the selectedTime
      const calendarMonths = () => {
        if (selectedTime === "Year") {
          const firstMonthStart = startOfMonth(startOfYear(showDate));
          const lastMonthEnd = endOfMonth(endOfYear(showDate));
          return eachMonthOfInterval({
            start: firstMonthStart,
            end: lastMonthEnd,
          });
        } else if (selectedTime === "AllTime") {
          const firstMonthStart = startOfMonth(
            new Date(journal[journal.length - 1].date)
          );
          const lastMonthEnd = endOfMonth(new Date(journal[0].date));
          return eachMonthOfInterval({
            start: firstMonthStart,
            end: lastMonthEnd,
          });
        }
      };

      calendarMonths().forEach((month) => {
        let totalHours = 0;
        filteredJournal.forEach((entry) => {
          if (isSameMonth(new Date(entry.date), month)) {
            totalHours += entry.length_in_minutes / 60;
          }
        });
        newData.push({
          date: formatDate(month, { month: "narrow" }),
          hours: totalHours,
        });
      });
      setData(newData);
    }

    if (selectedView === "Year") {
      newData = [];
      // Get Renderable Months depending on the selectedTime
      const calendarYears = () => {
        const firstYearStart = startOfYear(
          new Date(journal[journal.length - 1].date)
        );
        const lastYearEnd = endOfYear(new Date(journal[0].date));
        return eachYearOfInterval({
          start: firstYearStart,
          end: lastYearEnd,
        });
      };

      calendarYears().forEach((year) => {
        let totalHours = 0;
        filteredJournal.forEach((entry) => {
          if (isSameYear(new Date(entry.date), year)) {
            totalHours += entry.length_in_minutes / 60;
          }
        });
        newData.push({
          date: formatDate(year, { year: "numeric" }),
          hours: totalHours,
        });
      });
      setData(newData);
    }
  }, [journal, selectedTime, showDate, selectedView]);

  // Ensure valid view is set before rendering
  const validateView = () => {
    if (selectedTime === "Month" && selectedView === "Month") {
      setSelectedView("Week");
    } else if (selectedTime === "Year" && selectedView === "Year") {
      setSelectedView("Month");
    }
  };

  validateView();

  return (
    <div className="bg-bgSecondary rounded-md p-4 border border-borderPrimary">
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 h-fit items-center">
          {" "}
          <p className="IconBox">
            <FiBarChart />
          </p>
          <p className="text-lg">Aktiivisuus </p>
        </div>

        {/* Select boxes */}
        <div className="flex gap-4">
          {/* Select View */}
          {selectedTime === "Year" ||
          selectedTime === "AllTime" ||
          selectedTime === "Month" ? (
            <select
              name="viewSelect"
              id="selectView"
              className="bg-bgSecondary border border-borderPrimary text-textSecondary p-2 rounded-md
                    hover:cursor-pointer hover:bg-bgPrimary focus-visible:outline-none focus:bg-bgPrimary"
              value={selectedView}
              onChange={(e) => setSelectedView(e.target.value)}
            >
              <option value="Day">Päivä</option>
              <option value="Week">Viikko</option>
              {selectedTime === "Year" || selectedTime === "AllTime" ? (
                <option value="Month">Kuukausi</option>
              ) : null}
              {selectedTime === "AllTime" ? (
                <option value="Year">Vuosi</option>
              ) : null}
            </select>
          ) : null}

          {/* select Time */}
          <select
            name="timeFilter"
            id="selectTimeFilter"
            className="bg-bgSecondary border border-borderPrimary text-textSecondary p-2 rounded-md
           hover:cursor-pointer hover:bg-bgPrimary focus-visible:outline-none focus:bg-bgPrimary"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
          >
            <option value="Month">Kuukausi</option>
            <option value="Year">Vuosi</option>
            <option value="AllTime">Kaikki</option>
          </select>
        </div>
      </div>
      <div>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            margin={{ top: 0, right: 0, left: -30, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgb(var(--color-border-primary))"
            />
            <XAxis dataKey="date" stroke="rgb(var(--color-text-secondary))" />
            <YAxis
              dataKey="hours"
              name="Tunnit"
              stroke="rgb(var(--color-text-secondary))"
            />
            <Tooltip cursor={{ fill: "rgb(var(--color-bg-secondary))" }} />
            <Bar
              dataKey="hours"
              fill="rgb(var(--color-primary))"
              name="Treenattu"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default WeekDayActivity;

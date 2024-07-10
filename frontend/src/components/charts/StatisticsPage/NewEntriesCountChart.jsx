import {
  eachDayOfInterval,
  eachMonthOfInterval,
  eachWeekOfInterval,
  endOfMonth,
  endOfWeek,
  endOfYear,
  getWeek,
  isSameDay,
  isSameMonth,
  isSameWeek,
  startOfMonth,
  startOfWeek,
  startOfYear,
} from "date-fns";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import formatDate from "../../../utils/formatDate";

function NewEntriesCountChart({
  EntriesData,
  chartShowDate,
  selectedTime,
  selectedView,
}) {
  const chartData = formatEntryCountData(
    EntriesData,
    chartShowDate,
    selectedTime,
    selectedView
  );

  return (
    <div style={{ width: "100%", height: 200 }} className="">
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgb(var(--color-border-primary))"
          />
          <XAxis
            dataKey="date"
            stroke="rgb(var(--color-text-secondary))"
            name="Päivämäärä"
          />
          <YAxis
            dataKey="value"
            name="Merkintöjen määrä"
            stroke="rgb(var(--color-text-secondary))"
          />

          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.2)" }}
            contentStyle={{
              backgroundColor: "rgba(0,0,0,0.5)",
              border: "none",
            }}
            labelStyle={{ color: "rgba(255,255,255,0.8)" }}
            itemStyle={{ color: "rgba(255,255,255,0.8)" }}
          />

          <Legend />
          <Line
            type="monotone"
            dataKey="value"
            stroke="rgb(var(--color-primary))"
            activeDot={{ r: 8 }}
            name="Merkintöjen määrä"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// format entry count data for the chart
// returns an array of objects with count and date
// makes an object for each day / week in the set time period and loops through the entries to count the entries for each day
// returns an array of objects with the count and date
function formatEntryCountData(
  EntriesData,
  chartShowDate,
  selectedTime,
  selectedView
) {
  if (!EntriesData) return [];
  let formattedData = [];

  let startDay;
  let endDay;

  // set start and end day for the selected time period
  if (selectedTime === "Month") {
    startDay = startOfMonth(chartShowDate);
    endDay = endOfMonth(chartShowDate);
  } else if (selectedTime === "Year") {
    startDay = startOfYear(chartShowDate);
    endDay = endOfYear(chartShowDate);
  }

  if (selectedView === "Day") {
    const daysInMonth = eachDayOfInterval({
      start: startDay,
      end: endDay,
    });
    daysInMonth.forEach((day) => {
      const dayData = EntriesData.filter((entry) => {
        return isSameDay(new Date(entry.date), day);
      });
      formattedData.push({
        value: dayData.length,
        date:
          selectedTime === "Month"
            ? formatDate(day, { day: "numeric" })
            : formatDate(day, { month: "long", day: "numeric" }),
      });
    });
  } else if (selectedView === "Week") {
    const startMonth = startOfMonth(startDay);
    const endMonth = endOfMonth(endDay);

    const weeksInterval = eachWeekOfInterval({
      start: startOfWeek(startMonth, { weekStartsOn: 1 }),
      end: endOfWeek(endMonth, { weekStartsOn: 1 }),
    });

    weeksInterval.forEach((week) => {
      const weekStart = startOfWeek(week, { weekStartsOn: 1 });
      const weekEnd = endOfWeek(week, { weekStartsOn: 1 });

      if (weekEnd >= startMonth && weekStart <= endMonth) {
        const weekData = EntriesData.filter((entry) => {
          return isSameWeek(new Date(entry.date), week, {
            weekStartsOn: 1,
          });
        });
        formattedData.push({
          value: weekData.length,
          date:
            selectedTime === "Month"
              ? `${formatDate(startOfWeek(week, { weekStartsOn: 1 }), { day: "numeric" })} - ${formatDate(endOfWeek(week, { weekStartsOn: 1 }), { day: "numeric" })}`
              : getWeek(startOfWeek(week, { weekStartsOn: 1 }), {
                  weekStartsOn: 1,
                }),
        });
      }
    });
  } else if (selectedView === "Month") {
    if (selectedTime !== "Year") return [];

    const monthsInterval = eachMonthOfInterval({
      start: startDay,
      end: endDay,
    });

    monthsInterval.forEach((month) => {
      const monthData = EntriesData.filter((entry) => {
        return isSameMonth(new Date(entry.date), month);
      });
      formattedData.push({
        value: monthData.length,
        date: formatDate(month, { month: "long" }),
      });
    });
  }

  return formattedData;
}

export default NewEntriesCountChart;

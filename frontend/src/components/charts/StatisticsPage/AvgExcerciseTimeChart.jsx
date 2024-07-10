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

export default function AvgExcerciseTimeChart({
  EntriesData,
  chartShowDate,
  selectedTime,
  selectedView,
}) {
  const chartData = formatExcerciseTimeData(
    EntriesData,
    chartShowDate,
    selectedTime,
    selectedView
  );

  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <LineChart data={chartData}>
          <CartesianGrid
            strokeDasharray="5 5"
            stroke="rgb(var(--color-border-primary))"
          />
          <XAxis
            dataKey="date"
            stroke="rgb(var(--color-text-secondary))"
            name="Päivämäärä"
          />
          <YAxis
            dataKey="value"
            name="Uudet Opiskelijat"
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
            dot={false}
            activeDot={{ r: 8 }}
            name="liikunta-aika (min)"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// format exercise time data for the chart
// returns an array of objects with the total exercise time and date
function formatExcerciseTimeData(
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
    const daysInInterval = eachDayOfInterval({ start: startDay, end: endDay });
    daysInInterval.forEach((day) => {
      const dayData = EntriesData.filter((entry) =>
        isSameDay(new Date(entry.date), day)
      );
      const totalMinutes = dayData.reduce(
        (acc, entry) => acc + entry.length_in_minutes,
        0
      );
      formattedData.push({
        value: totalMinutes,
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
        const weekData = EntriesData.filter((entry) =>
          isSameWeek(new Date(entry.date), week, { weekStartsOn: 1 })
        );
        const totalMinutes = weekData.reduce(
          (acc, entry) => acc + entry.length_in_minutes,
          0
        );
        formattedData.push({
          value: totalMinutes,
          date:
            selectedTime === "Month"
              ? `${formatDate(weekStart, { day: "numeric" })} - ${formatDate(weekEnd, { day: "numeric" })}`
              : getWeek(weekStart, { weekStartsOn: 1 }),
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
      const monthData = EntriesData.filter((entry) =>
        isSameMonth(new Date(entry.date), month)
      );
      const totalMinutes = monthData.reduce(
        (acc, entry) => acc + entry.length_in_minutes,
        0
      );
      formattedData.push({
        value: totalMinutes,
        date: formatDate(month, { month: "long" }),
      });
    });
  }

  return formattedData;
}

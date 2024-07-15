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
import formatDate from "../../../utils/formatDate";

// format new student data for the chart
// returns an array of objects with the count of new students and date

export default function NewStudentsChart({
  newStudentsData,
  chartShowDate,
  selectedTime,
  selectedView,
}) {
  const chartData = formatNewStudentData(
    newStudentsData,
    chartShowDate,
    selectedTime,
    selectedView
  );

  return (
    <div style={{ width: "100%", height: 200 }}>
      <ResponsiveContainer>
        <LineChart
          data={chartData}
          margin={{ top: 0, right: 0, left: -35, bottom: 0 }}
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
            dot={false}
            stroke="rgb(var(--color-primary))"
            activeDot={{ r: 8 }}
            name="Uudet Opiskelijat"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function formatNewStudentData(
  newStudentsData,
  chartShowDate,
  selectedTime,
  selectedView
) {
  if (!newStudentsData) return [];
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

  const newStudentData = newStudentsData.filter((entry) => entry.created_at);

  if (selectedView === "Day") {
    const daysInInterval = eachDayOfInterval({
      start: startDay,
      end: endDay,
    });
    daysInInterval.forEach((day) => {
      const dayData = newStudentData.filter((entry) =>
        isSameDay(new Date(entry.created_at), day)
      );
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
        const weekData = newStudentData.filter((entry) =>
          isSameWeek(new Date(entry.created_at), week, { weekStartsOn: 1 })
        );
        formattedData.push({
          value: weekData.length,
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
      const monthData = newStudentData.filter((entry) =>
        isSameMonth(new Date(entry.created_at), month)
      );
      formattedData.push({
        value: monthData.length,
        date: formatDate(month, { month: "long" }),
      });
    });
  }

  return formattedData;
}

"use client";
import React, { useEffect, useState } from "react";
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
import { isSameMonth, isSameWeek, isSameYear, getDay } from "date-fns";

function WeekDayActivity({ journal }) {
  const { showDate } = useMainContext();
  const [selectedTime, setSelectedTime] = useState("Month");
  const [data, setData] = useState([
    { date: "Ma", hours: 0 },
    { date: "Ti", hours: 0 },
    { date: "Ke", hours: 0 },
    { date: "To", hours: 0 },
    { date: "Pe", hours: 0 },
    { date: "La", hours: 0 },
    { date: "Su", hours: 0 },
  ]);

  useEffect(() => {
    if (journal) {
      const filteredJournal = journal.filter((entry) => {
        console.log(entry);
        if (selectedTime === "Month") {
          return isSameMonth(showDate, new Date(entry.date), {
            weekStartsOn: 1,
          })
            ? entry
            : null;
        } else if (selectedTime === "Year") {
          return isSameYear(showDate, new Date(entry.date), {
            weekStartsOn: 1,
          })
            ? entry
            : null;
        } else {
          return entry;
        }
      });

      const newData = [
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
  }, [journal, selectedTime, showDate]);

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
        <div>
          <select
            name="timeFilter"
            id="selectTimeFilter"
            className="bg-bgSecondary border border-borderPrimary text-textSecondary p-2 rounded-md
           hover:cursor-pointer "
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

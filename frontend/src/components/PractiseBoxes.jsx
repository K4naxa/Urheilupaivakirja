import { useState, useEffect } from "react";
import dayjs from "dayjs";

const PractiseBoxes = ({ journalEntries }) => {
  const [showMonth, setShowMonth] = useState(true);
  const [trainingData, setTrainingData] = useState({
    hours: null,
    minutes: null,
    count: null,
    activity: null,
  });
  console.log(journalEntries);

  // Filter out all exept training practices

  useEffect(() => {
    if (journalEntries) {
      let filteredEntries = journalEntries.filter(
        (entry) => entry.intensity !== null
      );

      // filter out by month or year
      if (showMonth) {
        filteredEntries = filteredEntries.filter(
          (entry) => dayjs(entry.date).month() === dayjs().month()
        );
      } else {
        filteredEntries = filteredEntries.filter(
          (entry) => dayjs(entry.date).year() === dayjs().year()
        );
      }

      // Calculate total hours, minutes, count and activity
      let totalHours = 0;
      let totalMinutes = 0;
      let count = filteredEntries.length;
      let activity = 0;
      const currentDate = dayjs();

      // get unique days of the month or year that have exercises
      const uniqueDays = new Set(
        filteredEntries
          .filter((entry) => dayjs(entry.date).date() <= currentDate.date()) // Filter entries up to the current day
          .map((entry) => dayjs(entry.date).date())
      );

      // Calculate activity as a percentage
      if (showMonth) {
        activity = Math.floor(
          (uniqueDays.size / currentDate.daysInMonth()) * 100
        );
      } else {
        activity = Math.floor(
          (uniqueDays.size / currentDate.dayOfYear()) * 100
        );
      }

      // Calculate total hours and minutes
      filteredEntries.forEach((entry) => {
        totalMinutes += entry.length_in_minutes;
      });
      totalHours = Math.floor(totalMinutes / 60);
      totalMinutes = totalMinutes % 60;

      setTrainingData({
        hours: totalHours,
        minutes: totalMinutes,
        count: count,
        activity: activity,
      });
    }
  }, [journalEntries, showMonth]);

  return (
    <div>
      <div>
        <button onClick={() => setShowMonth(true)}>Show Month</button>
        <button onClick={() => setShowMonth(false)}>Show Year</button>
      </div>
      <div>
        <h1>Training Data</h1>
        <p>Hours: {trainingData.hours}</p>
        <p>Minutes: {trainingData.minutes}</p>
        <p>Count: {trainingData.count}</p>
        <p>Activity: {trainingData.activity}</p>
      </div>
    </div>
  );
};

export default PractiseBoxes;

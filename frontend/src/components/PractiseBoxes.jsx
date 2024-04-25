import { useState, useEffect } from "react";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";

const PractiseBoxes = ({ journalEntries }) => {
  const [showMonth, setShowMonth] = useState(true);
  const [trainingData, setTrainingData] = useState({
    hours: null,
    minutes: null,
    count: null,
    activity: null,
  });

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
      dayjs.extend(dayOfYear);
      if (showMonth) {
        activity = Math.floor((uniqueDays.size / dayjs().daysInMonth()) * 100);
      } else {
        activity = Math.floor((uniqueDays.size / dayjs().dayOfYear()) * 100);
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

  const boxClass = `bg-bgkSecondary flex flex-col p-3 rounded-md h-24 w-24 justify-center `;
  const highlightClass = `text-textPrimary self-center justify-self-center font-bold text-lg`;
  const secondaryText = `text-sm text-textSecondary justify-self-end`;

  return (
    <div className="block">
      <div>
        <button onClick={() => setShowMonth(true)}>Show Month</button>
        <button onClick={() => setShowMonth(false)}>Show Year</button>
      </div>
      <div className="flex gap-5 m-1  p-1">
        <div className={boxClass}>
          <p className="flex justify-center align-bottom">
            <p className={highlightClass}>{trainingData.hours}</p>
            <p className={secondaryText}> Tuntia</p>
          </p>
          <p className="flex">
            <span className={highlightClass}>{trainingData.minutes}</span>
            <p className={secondaryText}> min</p>
          </p>
          <p className={secondaryText}>Treenattu aika</p>
        </div>
        <div className={boxClass}>
          <p className="self-center justify-self-center font-bold text-lg">
            {trainingData.count}
          </p>
          <p className={secondaryText}>Treenikertaa</p>
        </div>
        <div className={boxClass}>
          <p>Activity: {trainingData.activity}%</p>
        </div>
      </div>
    </div>
  );
};

export default PractiseBoxes;

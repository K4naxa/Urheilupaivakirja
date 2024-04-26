import { useState, useEffect } from "react";
import { useMainContext } from "../hooks/mainContext";
import dayjs from "dayjs";
import dayOfYear from "dayjs/plugin/dayOfYear";

const PractiseBoxes = ({ journalEntries }) => {
  const { showDate } = useMainContext();
  const [showMonth, setShowMonth] = useState(true);
  const [trainingData, setTrainingData] = useState({
    hours: null,
    minutes: null,
    count: null,
    activity: null,
  });

  // Filter out all except training practices

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

      // Calculate total hours, minutes, count, and activity
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
    <div className="flex flex-col w-full">
      <div>
        <div className="flex gap-2 my-0 text-sm">
          <p className="text-lg">Harjoitukset</p>
          <p
            className={` my-auto hover:cursor-pointer hover:underline ${showMonth ? "text-textPrimary" : "text-textSecondary"}`}
            onClick={() => setShowMonth(true)}
          >
            Kuukausi
          </p>
          <p className="my-auto"> |</p>
          <p
            onClick={() => setShowMonth(false)}
            className={`my-auto hover:cursor-pointer hover:underline ${showMonth ? "text-textSecondary" : "text-textPrimary"}`}
          >
            Vuosi
          </p>
        </div>
      </div>
      <div className="flex justify-between my-1">
        <div className={boxClass}>
          <div className="flex justify-center align-bottom">
            <span className={highlightClass}>{trainingData.hours}</span>
            <span className={secondaryText}> Tuntia</span>
          </div>
          <div className="flex">
            <span className={highlightClass}>{trainingData.minutes}</span>
            <span className={secondaryText}> min</span>
          </div>
          <span className={secondaryText}>Treenattu aika</span>
        </div>
        <div className={boxClass}>
          <span className="self-center justify-self-center font-bold text-lg">
            {trainingData.count}
          </span>
          <span className={secondaryText}>Treenikertaa</span>
        </div>
        <div className={boxClass}>
          <span>Activity: {trainingData.activity}%</span>
        </div>
      </div>
    </div>
  );
};

export default PractiseBoxes;

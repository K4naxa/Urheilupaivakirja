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
        (entry) => entry.intensity !== null,
      );

      // filter out by month or year based on showDate
      if (showMonth) {
        filteredEntries = filteredEntries.filter(
          (entry) =>
            dayjs(entry.date).month() === dayjs(showDate).month() &&
            dayjs(entry.date).year() === dayjs(showDate).year(),
        );
      } else {
        filteredEntries = filteredEntries.filter(
          (entry) => dayjs(entry.date).year() === dayjs(showDate).year(),
        );
      }

      // Calculate total hours, minutes, count, and activity
      let totalHours = 0;
      let totalMinutes = 0;
      let count = filteredEntries.length;
      let activity = 0;

      // get unique days of the month or year that have exercises
      const uniqueDays = new Set(
        filteredEntries.map((entry) => dayjs(entry.date).date()),
      );

      // Calculate activity as a percentage
      dayjs.extend(dayOfYear);
      if (showMonth) {
        activity = Math.floor(
          (uniqueDays.size / dayjs(showDate).daysInMonth()) * 100,
        );
      } else {
        activity = Math.floor(
          (uniqueDays.size / dayjs(showDate).dayOfYear()) * 100,
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
  }, [journalEntries, showMonth, showDate]);

  const boxClass = `bg-bgkSecondary flex flex-col justify-between p-2 rounded-md w-24 h-24`;
  const highlightClass = `text-textPrimary self-center justify-self-center font-bold my-auto text-lg`;
  const secondaryText = `text-sm text-textSecondary text-center justify-self-center`;

  return (
    <div className="flex w-full flex-col gap-2">
      <div>
        <div className="my-0 flex gap-2 text-sm">
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
      <div className="min-w flex justify-between gap-2">
        <div className={boxClass}>
          <div className="grid grid-cols-2 items-center">
            <span className={highlightClass}>{trainingData.hours}</span>
            <span className={secondaryText}> Tuntia</span>
          </div>
          <div className="grid grid-cols-2 items-center">
            <span className={highlightClass}>{trainingData.minutes}</span>
            <span className={secondaryText}> min</span>
          </div>
          <span className={secondaryText}>Treenattu</span>
        </div>
        <div className={boxClass}>
          <span className={highlightClass}>{trainingData.count}</span>
          <span className={secondaryText}>Treenikertaa</span>
        </div>
        <div className={boxClass}>
          <span className={highlightClass}>{trainingData.activity}%</span>
          <span className={secondaryText}>Aktiivisuus</span>
        </div>
      </div>
    </div>
  );
};

export default PractiseBoxes;

import { useState, useEffect } from "react";
import CreateGraphCell from "./CreateGraphCell";
import { useMainContext } from "../hooks/mainContext";
import dayjs from "dayjs";

export default function WorkoutIntensityChart({ journal }) {
  const [data, setData] = useState({});
  const [showMonth, setShowMonth] = useState(true);
  const { showDate } = useMainContext();

  useEffect(() => {
    setData({
      one: 0,
      two: 0,
      three: 0,
    });

    let filteredEntries = journal.filter((entry) => entry.intensity !== null);
    if (showMonth) {
      filteredEntries = filteredEntries.filter(
        (entry) => dayjs(entry.date).month() === dayjs(showDate).month()
      );
    } else {
      filteredEntries = filteredEntries.filter(
        (entry) => dayjs(entry.date).year() === dayjs(showDate).year()
      );
    }

    const newData = {
      one: 0,
      two: 0,
      three: 0,
      totalEntries: 0,
    };

    filteredEntries.forEach((entry) => {
      newData.totalEntries++;
      if (entry.intensity === 1) newData.one++;
      if (entry.intensity === 2) newData.two++;
      if (entry.intensity === 3) newData.three++;
    });
    setData(newData);
  }, [journal, showMonth, showDate]);

  return (
    <div className="flex flex-col items-center w-full gap-2 bg-bgkSecondary rounded-md p-4">
      <h2 className="text-textPrimary text-center text-lg my-0 ">
        Harjoitusten Pituudet
      </h2>
      <div className="flex gap-2 my-0 text-sm">
        <p
          className={`hover:cursor-pointer hover:underline ${showMonth ? "text-textPrimary" : "text-textSecondary"}`}
          onClick={() => setShowMonth(true)}
        >
          Kuukausi
        </p>
        /
        <p
          onClick={() => setShowMonth(false)}
          className={`hover:cursor-pointer hover:underline ${showMonth ? "text-textSecondary" : "text-textPrimary"}`}
        >
          Vuosi
        </p>
      </div>
      <div className="flex flex-col gap-1 w-full">
        {" "}
        <CreateGraphCell
          value={data.one}
          max={data.totalEntries}
          text="Chilli"
        />
        <CreateGraphCell
          value={data.two}
          max={data.totalEntries}
          text="perus"
        />
        <CreateGraphCell
          value={data.three}
          max={data.totalEntries}
          text="Kova"
        />
      </div>
    </div>
  );
}

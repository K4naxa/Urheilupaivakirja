import { useState, useEffect } from "react";
import CreateGraphCell from "./CreateGraphCell";
import { useMainContext } from "../hooks/mainContext";
import { isSameMonth, isSameYear } from "date-fns";

export default function WorkoutIntensityChart({ journal }) {
  if (journal.journal_entries) journal = journal.journal_entries;
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
      filteredEntries = filteredEntries.filter((entry) =>
        isSameMonth(entry.date, showDate)
      );
    } else {
      filteredEntries = filteredEntries.filter((entry) =>
        isSameYear(entry.date, showDate)
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
    <div className="flex flex-col w-full gap-2">
      <div className="flex  gap-2">
        <h2 className="text-textPrimary text-lg">Treeni pituudet</h2>
        <p
          className={`hover:cursor-pointer hover:underline my-auto  text-sm ${showMonth ? "text-textPrimary" : "text-textSecondary"}`}
          onClick={() => setShowMonth(true)}
        >
          Kuukausi
        </p>
        <p className="my-auto">|</p>
        <p
          onClick={() => setShowMonth(false)}
          className={`hover:cursor-pointer hover:underline my-auto text-sm ${showMonth ? "text-textSecondary" : "text-textPrimary"}`}
        >
          Vuosi
        </p>
      </div>
      <div className="flex flex-col gap-1 w-full bg-bgkSecondary rounded-md p-4">
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

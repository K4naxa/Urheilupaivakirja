import { useState, useEffect } from "react";
import { useMainContext } from "../hooks/mainContext";
import CreateGraphCell from "./CreateGraphCell";
import dayjs from "dayjs";

export default function WorkoutActivityChart({ journal }) {
  if (journal.journal_entries) journal = journal.journal_entries;
  const [data, setData] = useState({});
  const [showMonth, setShowMonth] = useState(true);
  const { showDate } = useMainContext();

  useEffect(() => {
    setData({
      one: 0,
      two: 0,
      three: 0,
      rest: 0,
      sick: 0,
      totalEntries: 0,
    });

    let filteredEntries = [...journal];
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
      rest: 0,
      sick: 0,
      totalEntries: filteredEntries.length,
    };

    filteredEntries.forEach((entry) => {
      if (entry.entry_type_id === 1) {
        if (entry.length_in_minutes >= 180) {
          newData.three++;
        }
        if (entry.length_in_minutes >= 120 && entry.length_in_minutes < 180) {
          newData.two++;
        }
        if (entry.length_in_minutes < 120) {
          newData.one++;
        }
      } else if (entry.entry_type_id === 2) {
        newData.rest++;
      } else {
        newData.sick++;
      }
    });
    setData(newData);
  }, [journal, showMonth, showDate]);

  return (
    <div className="flex flex-col w-full gap-2 ">
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
          text="1 Tunti"
        />
        <CreateGraphCell
          value={data.two}
          max={data.totalEntries}
          text="2 Tunti"
        />
        <CreateGraphCell
          value={data.three}
          max={data.totalEntries}
          text="+3 Tuntia"
        />
        <CreateGraphCell
          value={data.rest}
          max={data.totalEntries}
          text="Lepo"
        />
        <CreateGraphCell
          value={data.sick}
          max={data.totalEntries}
          text="Sairaana"
        />
      </div>
    </div>
  );
}

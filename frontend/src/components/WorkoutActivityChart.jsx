import { useState, useEffect } from "react";
import dayjs from "dayjs";

const CreateGraphCell = ({ value, max, text }) => {
  const percentage = Math.round((value / max) * 1000) / 10;

  return (
    <div className="flex flex-col w-full">
      <h4 className="text-textPrimary">{text}</h4>
      <p className="text-textSecondary text-sm">{percentage}%</p>
      <div className={`flex h-1 w-full bg-graphSecondary rounded-sm`}>
        <div
          className={`flex h-full bg-graphPrimary rounded-sm`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

export default function WorkoutActivityChart({ journal }) {
  const [data, setData] = useState({
    one: 0,
    two: 0,
    three: 0,
    rest: 0,
    sick: 0,
    totalEntries: 0,
  });
  const [showMonth, setShowMonth] = useState(true);

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
        (entry) => dayjs(entry.date).month() === dayjs().month()
      );
    } else {
      filteredEntries = filteredEntries.filter(
        (entry) => dayjs(entry.date).year() === dayjs().year()
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
  }, [journal, showMonth]);

  return (
    <div className="flex flex-col gap-4 items-center bg-bgkSecondary w-96 p-5 rounded-md">
      <div className="flex flex-col items-center w-full gap-4">
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

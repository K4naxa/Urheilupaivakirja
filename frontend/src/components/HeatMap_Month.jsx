import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { useMainContext } from "../hooks/mainContext";
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";

const HeatMap_Month = ({ journal }) => {
  const { showDate, setShowDate } = useMainContext();
  const [data, setData] = useState([]);
  const cal = new CalHeatmap();
  const monthNames = [
    "Tammikuu",
    "Helmikuu",
    "Maaliskuu",
    "Huhtikuu",
    "Toukokuu",
    "Kesäkuu",
    "Heinäkuu",
    "Elokuu",
    "Syyskuu",
    "Lokakuu",
    "Marraskuu",
    "Joulukuu",
  ];

  const handlePreviousMonthClick = (e) => {
    e.preventDefault();
    const newDate = new Date(showDate.getFullYear(), showDate.getMonth() - 1);
    setShowDate(newDate);
  };

  const handleNextMonthClick = (e) => {
    e.preventDefault();
    const newDate = new Date(showDate.getFullYear(), showDate.getMonth() + 1);
    setShowDate(newDate);
  };
  const handlePreviousYearClick = (e) => {
    e.preventDefault();
    const newDate = new Date(showDate.getFullYear() - 1, showDate.getMonth());
    setShowDate(newDate);
  };

  const handleNextYearClick = (e) => {
    e.preventDefault();
    const newDate = new Date(showDate.getFullYear() + 1, showDate.getMonth());
    setShowDate(newDate);
  };

  useEffect(() => {
    // clean up the data for the heatmap
    const entries = journal.map((entry) => {
      const date = dayjs(entry.date).format("YYYY-MM-DD"); // format the date for the heatmap
      let value = entry.length_in_minutes;

      if (entry.entry_type_id === 3) value = -99; // color value for sick day

      return {
        date: date,
        value: value,
        entry_type: entry.entry_type_id,
      };
    });
    setData(entries);
  }, [journal]);

  useEffect(() => {
    document.getElementById("cal-heatmapMonth").innerHTML = "";
    const theme = document.querySelector("html").getAttribute("data-theme");

    cal.paint(
      {
        itemSelector: "#cal-heatmapMonth",
        theme: theme,

        date: {
          start: showDate,
          max: new Date(2024, 12, 31),
          highlight: new Date(),
          name: "x-pseudo",
          locale: {
            weekStart: 1,
            timezone: "Europe/Helsinki",
            months:
              "Tammikuu_Helmikuu_Maaliskuu_Huhtikuu_Toukokuu_Kesäkuu_Heinäkuu_Elokuu_Syyskuu_Lokakuu_Marraskuu_Joulukuu".split(
                "_"
              ),
          },
        },
        Animation: null,
        range: 1,
        data: {
          source: data,
          x: "date",
          y: "value",
          groupY: "sum",
        },
        scale: {
          color: {
            range: ["#CCA700", "gray", "lightgreen", "green", "darkgreen"],
            type: "linear",
            domain: [-99, 0, 60, 120, 180],
          },
        },

        domain: {
          type: "month",
          gutter: 10,
          label: {
            text: null,
          },
        },
        subDomain: {
          type: "day",
          width: 65,
          height: 65,
          gutter: 10,
          radius: 5,
        },
      },
      [
        [
          Tooltip,
          {
            text: function (date, value) {
              if (value === null || undefined) return;
              if (value === -99)
                return (
                  "<div>" +
                  dayjs(date).format("DD/MM/YYYY") +
                  "</div>" +
                  "Sairaana"
                );
              if (value === 0)
                return (
                  "<div>" + dayjs(date).format("DD/MM/YYYY") + "</div>" + "Lepo"
                );

              const hours = Math.floor(value / 60);
              const minutes = value % 60;

              if (value)
                return (
                  "<div>" +
                  dayjs(date).format("DD/MM/YYYY") +
                  "</div>" +
                  "<div>" +
                  +hours +
                  "h : " +
                  minutes +
                  "m " +
                  "Treenattu" +
                  "</div>"
                );
            },
          },
        ],

        [
          CalendarLabel,
          {
            position: "left",
            key: "left",
            height: 65,
            gutter: 10,
            width: 30,
            text: () => ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"],
          },
        ],
      ]
    );
  }, [data, showDate]);

  return (
    <div className="flex flex-col w-full text-center ">
      <div className="flex justify-center gap-4">
        <button className="hover:underline" onClick={handlePreviousYearClick}>
          Previous
        </button>
        <h2 className="text-textPrimary text-3xl">{showDate.getFullYear()}</h2>
        <button className="hover:underline" onClick={handleNextYearClick}>
          Next
        </button>
      </div>
      <div className="flex gap-4 justify-center">
        <button className="hover:underline" onClick={handlePreviousMonthClick}>
          Previous
        </button>
        <p>{monthNames[showDate.getMonth()]}</p>
        <button className="hover:underline" onClick={handleNextMonthClick}>
          Next
        </button>
      </div>
      <div id="cal-heatmapMonth"></div>
    </div>
  );
};

export default HeatMap_Month;

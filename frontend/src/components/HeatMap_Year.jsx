import { useEffect, useState } from "react";
import dayjs from "dayjs";

import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";

const HeatMap_Year = ({ journal }) => {
  const [data, setData] = useState([]);
  const cal = new CalHeatmap();

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
    document.getElementById("cal-heatmapYear").innerHTML = "";

    cal.paint(
      {
        itemSelector: "#cal-heatmapYear",
        theme: "dark",

        date: {
          start: new Date(2024, 1, 1),
          max: new Date(2024, 12, 31),
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
        range: 12,
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
            position: "top",
            align: "center",
            width: 50,
          },
        },
        subDomain: {
          type: "day",
          width: 17,
          height: 17,
          gutter: 4,
          radius: 2,
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
            text: () => ["", "Ma", "", "Ke", "", "Pe", "", "Su"],
            padding: [0, 5, 0, 0],
          },
        ],
      ]
    );
  }, [data]);

  return (
    <div className="heatmapYear-container">
      <h1>Heatmap</h1>
      <div className="controls">
        <a
          onClick={(e) => {
            e.preventDefault();
            cal.previous();
          }}
        >
          Previous
        </a>
        <a
          onClick={(e) => {
            e.preventDefault();
            cal.next();
          }}
        >
          Next
        </a>
      </div>
      <div id="cal-heatmapYear"></div>
    </div>
  );
};

export default HeatMap_Year;

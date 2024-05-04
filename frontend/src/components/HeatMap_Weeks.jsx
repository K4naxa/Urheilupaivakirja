import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useMainContext } from "../hooks/mainContext";

import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";

const HeatMap_Weeks = ({ journal }) => {
  const { showDate } = useMainContext();

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
    document.getElementById("cal-heatmapWeeks").innerHTML = "";
    const theme = document.documentElement.getAttribute("data-theme");

    cal.paint(
      {
        itemSelector: "#cal-heatmapWeeks",
        animationDuration: 0,
        theme: theme,

        date: {
          start: new Date(showDate - 1000 * 60 * 60 * 24 * 14),
          highlight: new Date(),
          name: "x-pseudo",
          locale: {
            weekStart: 1,
            timezone: "Europe/Helsinki",
          },
        },
        range: 2,
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
          type: "week",
          gutter: 10,
          label: {
            position: "top",
            align: "center",
            width: 20,
          },
        },
        subDomain: {
          type: "day",
          width: 17,
          height: 17,
          gutter: 5,
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
            position: "top",
            key: "top",
            text: () => ["", "Ma", "", "Ke", "", "Pe", "", "Su"],
            padding: [0, 5, 0, 0],
            height: 17,
            gutter: 5,
          },
        ],
      ]
    );
  }, [data, showDate]);

  return <div id="cal-heatmapWeeks" className="flex w-full"></div>;
};

export default HeatMap_Weeks;

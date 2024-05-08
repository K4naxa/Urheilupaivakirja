import { useEffect, useRef } from "react";
import dayjs from "dayjs";
import { useMainContext } from "../hooks/mainContext";
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";

const HeatMap_Month = ({ journal }) => {
  const { showDate } = useMainContext();
  const calRef = useRef(null);

  // change the date of the heatmap
  useEffect(() => {
    if (calRef.current) {
      const updatedDate = new Date(
        showDate.getFullYear(),
        showDate.getMonth(),
        5
      );
      calRef.current.jumpTo(updatedDate);
    }
  }, [showDate]);

  // Update if the CalHeatmap instance exists
  useEffect(() => {
    if (!calRef.current) return; // Dont run if the heatmap is not created yet

    const entries = journal.journal_entries.map((entry) => {
      const date = dayjs(entry.date).format("YYYY-MM-DD");
      let value = entry.length_in_minutes;
      if (entry.entry_type_id === 3) value = -99;
      return {
        date: date,
        value: value,
        entry_type: entry.entry_type_id,
      };
    });
    const data = entries;

    // "fill" updates the data in the heatmap
    calRef.current.fill(data);
  }, [journal]);

  // create new Heatmap if it does not exist
  useEffect(() => {
    if (calRef.current) return;

    // clean up the data for the heatmap
    const data = journal.journal_entries.map((entry) => {
      const date = dayjs(entry.date).format("YYYY-MM-DD"); // format the date for the heatmap
      let value = entry.length_in_minutes;

      if (entry.entry_type_id === 3) value = -99; // color value for sick day

      return {
        date: date,
        value: value,
        entry_type: entry.entry_type_id,
      };
    });

    const newDate = new Date(showDate.getFullYear(), showDate.getMonth(), 5);
    const theme = document.querySelector("html").getAttribute("data-theme");
    calRef.current = new CalHeatmap();
    calRef.current.paint(
      {
        itemSelector: `#cal-heatmapMonth${journal.user_id}`,
        theme: theme,

        date: {
          start: newDate,
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
        animationDuration: 0,
        range: 1,
        data: {
          source: data,
          x: "date",
          y: "value",
          groupY: "sum",
        },
        scale: {
          color: {
            range: ["blue", "gray", "lightgreen", "green", "darkgreen"],
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
          type: "xDay",
          width: 25,
          height: 25,
          gutter: 5,
          radius: 5,
          label: "D",
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
            key: "weekdays",
            height: 20,
            gutter: 5,
            width: 25,
            text: () => ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"],
          },
        ],
      ]
    );
  }, [journal, showDate]);

  return (
    <div className="flex w-full flex-col gap-4 text-center">
      {/* heatmap */}

      <div
        id={`cal-heatmapMonth${journal.user_id}`}
        className="flex w-full justify-center"
      ></div>
    </div>
  );
};

export default HeatMap_Month;

import { useState, useEffect } from "react";
import dayjs from "dayjs";

import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";
import LegendLite from "cal-heatmap/plugins/LegendLite";

import trainingService from "../services/trainingService";
import { useAuth } from "../hooks/useAuth";

const HeatMap_Year = () => {
  const [data, setData] = useState([]);
  const [dataForMap, setDataForMap] = useState([]);

  useEffect(() => {
    trainingService.getJournalEntries().then((data) => {
      console.log(data);
      // clean up the data for the heatmap
      const entries = data.map((entry) => {
        const date = dayjs(entry.date).valueOf();
        const value = entry.length_in_minutes;
        return {
          date: date,
          value: value,
        };
      });
      setData(data);
      setDataForMap(entries);
    });
  }, []);

  const cal = new CalHeatmap();

  useEffect(() => {
    cal.paint(
      {
        itemSelector: "#cal-heatmap",
        theme: "dark",
        date: {
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
          source: dataForMap,
          x: "date",
          y: "value",
          groupY: "sum",
        },
        scale: {
          color: {
            scheme: "greens",
            type: "linear",
            domain: [0, 180],
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
            text: function (date, value, data) {
              const hours = Math.floor(value / 60);
              const minutes = value % 60;

              return value
                ? "<div>" +
                    dayjs(date).format("DD/MM/YYYY") +
                    "</div>" +
                    "<div>" +
                    +hours +
                    "h : " +
                    minutes +
                    "m " +
                    "Treenattu" +
                    "</div>"
                : null;
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
        [
          LegendLite,
          {
            itemSelector: "#map-legend",
            includeBlank: false,
            legendCellSize: 20,
          },
        ],
      ]
    );
  }, [data]);

  return (
    <div className="heatmap-container">
      <h1>Heatmap</h1>
      <div id="cal-heatmap"></div>
      <div
        id="map-legend"
        style={{ display: "inline-block", margin: "0 8px" }}
      ></div>
    </div>
  );
};

export default HeatMap_Year;

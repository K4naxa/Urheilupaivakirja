import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { useMainContext } from "../hooks/mainContext";
import CalHeatmap from "cal-heatmap";
import "cal-heatmap/cal-heatmap.css";
import Tooltip from "cal-heatmap/plugins/Tooltip";
import CalendarLabel from "cal-heatmap/plugins/CalendarLabel";
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { IconContext } from "react-icons/lib";

import { useDateModal } from "../hooks/useDateModal";
import DateModal from "./DateModal";

const HeatMap_Month = ({ journal }) => {
  const { dateModalOpen, showDateModal } = useDateModal();
  const { showDate, setShowDate } = useMainContext();
  const [data, setData] = useState([]);
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

  const handleDateClick = (event, date) => {
    const targetElement = event.target;
    const rect = targetElement.getBoundingClientRect();
  
    const modalWidth = 228;
    const verticalMargin = 5;
    const arrowWidth = -10;

    const idealLeft = rect.left + rect.width / 2 - modalWidth / 2 + window.scrollX; // Perfect center position
    const screenWidth = window.innerWidth;
  
    // Adjusted for screen overflow
    let left = Math.max(0, Math.min(screenWidth - modalWidth, idealLeft));
    let top = rect.top + rect.height + window.scrollY + verticalMargin;  // Added vertical margin
  
    // Calculate arrow position based on the modal's actual position
    let arrowLeft = modalWidth / 2;  // Center arrow in modal by default
    if (left !== idealLeft) {
      // Calculate offset if modal was moved due to boundary constraints
      arrowLeft += (idealLeft - left);
    }
    arrowLeft += arrowWidth;
    console.log("arrowLeft in heatmap", arrowLeft);
    // Pass to the modal display function
    showDateModal(left, top, arrowLeft, date);
  };
  

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
    const container = document.getElementById("cal-heatmapMonth");
    if (!container) return; // Exit early if container doesn't exist
    container.innerHTML = "";

    const theme = document.querySelector("html").getAttribute("data-theme");

    const cal = new CalHeatmap();

    cal.on("click", (event, timestamp) => {
      handleDateClick(event, dayjs(timestamp).format("YYYY-MM-DD"));
    });

    cal.paint(
      {
        itemSelector: "#cal-heatmapMonth",
        theme: theme,

        date: {
          start: dayjs(
            new Date(showDate.getFullYear(), showDate.getMonth(), 5)
          ).format("YYYY-MM-DD"),
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
          type: "xDay",
          width: 45,
          height: 45,
          gutter: 7,
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
            gutter: 7,
            width: 45,
            text: () => ["Ma", "Ti", "Ke", "To", "Pe", "La", "Su"],
          },
        ],
      ]
    );

    return () => {
      const cal = document.querySelector("#cal-heatmapMonth");
      if (cal) cal.innerHTML = "";
    };
  }, [data, showDate]);

  return (
    <div className="flex w-full flex-col gap-4 text-center">
      {/* date controls */}
      <div className="flex w-full flex-col text-center">
        <h2 className="text-textSecondary">{showDate.getFullYear()}</h2>
        <div className="hover: flex justify-center gap-4">
          <button
            className="hover:underline"
            onClick={handlePreviousMonthClick}
          >
            <IconContext.Provider
              value={{ className: "hover:text-graphPrimary" }}
            >
              <FiChevronLeft />
            </IconContext.Provider>
          </button>
          <p className="text-xl">{monthNames[showDate.getMonth()]}</p>
          <button
            className="hover:fill-blue-500 hover:underline"
            onClick={handleNextMonthClick}
          >
            <IconContext.Provider
              value={{ className: "hover:text-graphPrimary" }}
            >
              <FiChevronRight />
            </IconContext.Provider>
          </button>
        </div>
      </div>

      {/* heatmap */}

      <div id="cal-heatmapMonth" className="flex w-full justify-center"></div>
      {dateModalOpen && <DateModal />}
    </div>
  );
};

export default HeatMap_Month;

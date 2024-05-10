import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { IconContext } from "react-icons/lib";

import HeatMap_Month from "../components/Heatmaps/HeatMap_Month";
import HeatMap_Year from "../components/Heatmaps/HeatMap_Year";
import HeatMap_Weeks from "../components/Heatmaps/HeatMap_Weeks";
import trainingService from "../services/trainingService";
import formatDate from "../utils/formatDate";

import { useQuery } from "@tanstack/react-query";

import { useMainContext } from "../hooks/mainContext";
import { addMonths, subMonths } from "date-fns";

function Testisivu() {
  const { showDate, setShowDate } = useMainContext();
  const { data: studentJournalData } = useQuery({
    queryKey: ["studentJournal"],
    queryFn: () => trainingService.getAllUserJournalEntries(),
    staleTime: 15 * 60 * 1000, // = 15 minutes in milliseconds - how long to use the cached data before re-fetching
  });

  return (
    <div className="flex flex-col w-full gap-1">
      <div className="flex w-full flex-col text-center">
        <h2 className="text-textSecondary">{showDate.getFullYear()}</h2>
        <div className="hover: flex justify-center gap-4">
          <button
            className="hover:underline"
            onClick={() => {
              setShowDate(subMonths(showDate, 1)); // Update showDate
            }}
          >
            <IconContext.Provider
              value={{ className: "hover:text-graphPrimary" }}
            >
              <FiChevronLeft />
            </IconContext.Provider>
          </button>
          <p className="text-xl w-24">
            {formatDate(showDate, { month: "long" })}
          </p>
          <button
            className="hover:fill-blue-500 hover:underline"
            onClick={() => {
              setShowDate(addMonths(showDate, 1)); // Update showDate
            }}
          >
            <IconContext.Provider
              value={{ className: "hover:text-graphPrimary" }}
            >
              <FiChevronRight />
            </IconContext.Provider>
          </button>
        </div>
      </div>
      <div>
        <HeatMap_Month journal={studentJournalData} />
      </div>
      <HeatMap_Weeks journal={studentJournalData} />
    </div>
  );
}

export default Testisivu;

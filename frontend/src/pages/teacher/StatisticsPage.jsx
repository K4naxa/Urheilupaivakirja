import NewEntriesCountChart from "../../components/charts/StatisticsPage/NewEntriesCountChart";
import AvgExcerciseTimeChart from "../../components/charts/StatisticsPage/AvgExcerciseTimeChart";
import NewStudentsChart from "../../components/charts/StatisticsPage/NewStudentsChart";
import AvgSickdaysChart from "../../components/charts/StatisticsPage/AvgSickdaysChart";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { addMonths, endOfMonth, startOfMonth, subMonths } from "date-fns";
import formatDate from "../../utils/formatDate";
import userService from "../../services/userService";
import { useQueryClient } from "@tanstack/react-query";

function StatisticsPage() {
  const queryclient = useQueryClient();
  const [chartShowDate, setChartShowDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("Month");
  const [selectedView, setSelectedView] = useState("Day");

  const { data: avgEntriesData, isLoading: avgEntriesLoading } = useQuery({
    queryKey: ["avgEntriesData", selectedTime, selectedView],
    queryFn: () => {
      if (selectedTime === "Month") {
        return userService.getAllJournalEntryDataBetweenDates(
          startOfMonth(chartShowDate),
          endOfMonth(chartShowDate)
        );
      } else if (selectedTime === "Year") {
        return userService.getAllJournalEntryDataBetweenDates(
          startOfMonth(chartShowDate),
          endOfMonth(chartShowDate)
        );
      } else if (selectedTime === "AllTime") {
        return userService.getAllJournalEntryDataBetweenDates(
          startOfMonth(chartShowDate),
          endOfMonth(chartShowDate)
        );
      }
    },
  });

  useEffect(() => {
    queryclient.invalidateQueries("avgEntriesData");
  }, [selectedTime, chartShowDate]);

  useEffect(() => {
    if (!avgEntriesLoading) console.log(avgEntriesData);
  }, [avgEntriesData, avgEntriesLoading]);

  const graphContainerClass =
    "flex flex-col gap-4 items-center justify-center bg-bgSecondary p-4 rounded-md border-borderPrimary border-2";
  return (
    <div>
      <div className="flex flex-col gap-8 m-4">
        <h1 className="text-2xl text-center">Tilastot</h1>

        <div className="flex gap-8 justify-center">
          {/* ShowDate Change*/}
          <div className="flex flex-col text-center">
            <div className="text-textSecondary">
              {chartShowDate.getFullYear()}
            </div>
            <div className="w-full flex justify-center items-center bg-bgSecondary p-1 rounded-md border border-borderPrimary text-textSecondary">
              <p
                className="text-textPrimary hover:text-primaryColor hover:cursor-pointer select-none"
                onClick={() => {
                  setChartShowDate(subMonths(chartShowDate, 1));
                }}
              >
                <FiChevronLeft />
              </p>

              <p className="w-32 text-lg">
                {formatDate(chartShowDate, { month: "long" })}
              </p>

              <p
                className="text-textPrimary hover:text-primaryColor hover:cursor-pointer select-none"
                onClick={() => {
                  setChartShowDate(addMonths(chartShowDate, 1));
                }}
              >
                <FiChevronRight />
              </p>
            </div>
          </div>
          {/* Select boxes */}
          <div className="flex gap-8 items-center justify-center">
            <div className="flex flex-col">
              {" "}
              {/* Select View */}
              <label
                htmlFor="viewSelect"
                className="text-textSecondary text-xs px-2"
              >
                Näkyvyys:
              </label>
              {selectedTime === "Year" ||
              selectedTime === "AllTime" ||
              selectedTime === "Month" ? (
                <select
                  name="viewSelect"
                  id="selectView"
                  className="bg-bgSecondary border border-borderPrimary text-textSecondary p-2 rounded-md
                    hover:cursor-pointer hover:bg-bgPrimary focus-visible:outline-none focus:bg-bgPrimary"
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value)}
                >
                  <option value="Day">Päivä</option>
                  <option value="Week">Viikko</option>
                  {selectedTime === "Year" || selectedTime === "AllTime" ? (
                    <option value="Month">Kuukausi</option>
                  ) : null}
                  {selectedTime === "AllTime" ? (
                    <option value="Year">Vuosi</option>
                  ) : null}
                </select>
              ) : null}
            </div>

            <div className="flex flex-col">
              {/* select Time */}
              <label
                htmlFor="timeFilter"
                className="text-textSecondary text-xs px-2"
              >
                Aika:
              </label>
              <select
                name="timeFilter"
                id="selectTimeFilter"
                className="bg-bgSecondary border border-borderPrimary text-textSecondary p-2 rounded-md
           hover:cursor-pointer hover:bg-bgPrimary focus-visible:outline-none focus:bg-bgPrimary"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
              >
                <option value="Month">Kuukausi</option>
                <option value="Year">Vuosi</option>
              </select>
            </div>
          </div>{" "}
        </div>

        <div className="grid grid-cols-1 gap-4 lg:gap-8 lg:grid-cols-2 items-center text-center ">
          <div className={graphContainerClass}>
            <NewEntriesCountChart />
          </div>
          <div className={graphContainerClass}>
            <AvgExcerciseTimeChart />
          </div>
          <div className={graphContainerClass}>
            <NewStudentsChart />
          </div>
          <div className={graphContainerClass}>
            <AvgSickdaysChart />
          </div>
        </div>
        <div className="flex gap-8 justify-center ">
          <div className="flex flex-col gap-2 items-center justify-center bg-bgSecondary p-4 rounded-md border-borderPrimary border-2 w-48">
            <p className=""> Opiskelijoiden määrä:</p>{" "}
            <p className="text-xl text-primaryColor">89</p>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center bg-bgSecondary p-4 rounded-md border-borderPrimary border-2 w-48">
            <p> Merkintöjen määrä:</p>{" "}
            <p className="text-xl text-primaryColor">698</p>
          </div>
          <div className="flex flex-col gap-2 items-center justify-center bg-bgSecondary p-4 rounded-md border-borderPrimary border-2 w-48">
            <p> Urheiltu aika:</p>{" "}
            <p className="text-xl text-primaryColor">0h 45min</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;

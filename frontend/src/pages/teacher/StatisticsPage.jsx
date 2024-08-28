import NewEntriesCountChart from "../../components/charts/StatisticsPage/NewEntriesCountChart";
import AvgExcerciseTimeChart from "../../components/charts/StatisticsPage/AvgExcerciseTimeChart";
import NewStudentsChart from "../../components/charts/StatisticsPage/NewStudentsChart";
import AvgSickdaysChart from "../../components/charts/StatisticsPage/AvgSickdaysChart";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  addMonths,
  addYears,
  endOfMonth,
  endOfYear,
  startOfMonth,
  startOfYear,
  subMonths,
  subYears,
} from "date-fns";
import formatDate from "../../utils/formatDate";
import statisticsService from "../../services/statisticsService";
import { useQueryClient } from "@tanstack/react-query";
import LoadingScreen from "../../components/LoadingScreen";

function StatisticsPage() {
  const queryclient = useQueryClient();
  const [chartShowDate, setChartShowDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("Month");
  const [selectedView, setSelectedView] = useState("Day");

  // Get data for the  journal info graphs (new entries, avg excercise time, avg sickdays)
  const { data: EntriesData, isPending: EntriesLoading } = useQuery({
    queryKey: ["EntriesData", selectedTime, selectedView],
    queryFn: () => {
      if (selectedTime === "Month") {
        return statisticsService.getAllJournalEntryDataBetweenDates(
          startOfMonth(chartShowDate),
          endOfMonth(chartShowDate)
        );
      } else if (selectedTime === "Year") {
        return statisticsService.getAllJournalEntryDataBetweenDates(
          startOfYear(chartShowDate),
          endOfYear(chartShowDate)
        );
      }
    },
  });

  // Get data for the new students graph
  const { data: newStudentsData, isPending: NewStudentsLoading } = useQuery({
    queryKey: ["newStudentsData", selectedTime],
    queryFn: () => {
      if (selectedTime === "Month") {
        return statisticsService.getNewStudentsBetweenDates(
          startOfMonth(chartShowDate),
          endOfMonth(chartShowDate)
        );
      } else if (selectedTime === "Year") {
        return statisticsService.getNewStudentsBetweenDates(
          startOfYear(chartShowDate),
          endOfYear(chartShowDate)
        );
      }
    },
  });

  useEffect(() => {
    if (!NewStudentsLoading) {
      console.log(EntriesData);
      console.log(newStudentsData);
    }
  }, [newStudentsData, NewStudentsLoading, selectedTime, chartShowDate]);

  // -----------------------------------------------------------------------------------------


  // invalidate queries when changing the selected time or view
  useEffect(() => {
    queryclient.invalidateQueries("EntriesData");
    queryclient.invalidateQueries("newStudentsData");
  }, [selectedTime, chartShowDate, selectedView]);

  if (EntriesLoading || NewStudentsLoading) {
    return <LoadingScreen />;
  }

  const graphContainerClass =
    "flex flex-col gap-4 items-center justify-center bg-bgSecondary p-4 rounded-md border-borderPrimary border-2";

  const timeSelectWithMonth = (
    <div className="flex flex-col text-center justify-end ">
      <div className="text-textSecondary text-sm">
        {chartShowDate.getFullYear()}
      </div>
      <div className="w-full flex justify-center items-center bg-bgSecondary p-1 rounded-md border border-borderPrimary text-textSecondary ">
        <p
          className="text-textPrimary hover:text-primaryColor hover:cursor-pointer select-none"
          onClick={() => {
            setChartShowDate(subMonths(chartShowDate, 1));
          }}
        >
          <FiChevronLeft />
        </p>

        <p className="w-28 ">{formatDate(chartShowDate, { month: "long" })}</p>

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
  );
  const timeSelectWithYear = (
    <div className="flex flex-col text-center justify-end">
      
      <div className="w-full flex justify-center items-center bg-bgSecondary p-1 rounded-md border border-borderPrimary text-textSecondary align-bottom">
        <p
          className="text-textPrimary hover:text-primaryColor hover:cursor-pointer select-none"
          onClick={() => {
            setChartShowDate(subYears(chartShowDate, 1));
          }}
        >
          <FiChevronLeft />
        </p>

        <p className="w-28">{chartShowDate.getFullYear()}</p>

        <p
          className="text-textPrimary hover:text-primaryColor hover:cursor-pointer select-none"
          onClick={() => {
            setChartShowDate(addYears(chartShowDate, 1));
          }}
        >
          <FiChevronRight />
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col w-full gap-8 p-4">
      <div className="flex p-4 pb-0 flex-wrap gap-8 justify-center">
        {/* ShowDate Change*/}
        {selectedTime === "Month" ? timeSelectWithMonth : timeSelectWithYear}
        {/* Select boxes */}
        <div className="flex gap-8 items-center justify-end">
          <div className="flex flex-col">
            {" "}
            {/* Select View */}
            <label
              htmlFor="viewSelect"
              className="text-textSecondary text-sm px-2"
            >
              Ryhmitys:
            </label>
            {selectedTime === "Year" || selectedTime === "Month" ? (
              <select
                name="viewSelect"
                id="selectView"
                className="bg-bgSecondary w-28 border border-borderPrimary text-textSecondary p-2 rounded-md
                    hover:cursor-pointer hover:bg-bgPrimary focus-visible:outline-none focus:bg-bgPrimary"
                value={selectedView}
                onChange={(e) => setSelectedView(e.target.value)}
              >
                <option value="Day">Päivä</option>
                <option value="Week">Viikko</option>
                {selectedTime === "Year" ? (
                  <option value="Month">Kuukausi</option>
                ) : null}
              </select>
            ) : null}
          </div>

          <div className="flex flex-col">
            {/* select Time */}
            <label
              htmlFor="timeFilter"
              className="text-textSecondary text-sm px-2"
            >
              Ajanjakso:
            </label>
            <select
              name="timeFilter"
              id="selectTimeFilter"
              className="bg-bgSecondary w-28 border border-borderPrimary text-textSecondary p-2 rounded-md
           hover:cursor-pointer hover:bg-bgPrimary focus-visible:outline-none focus:bg-bgPrimary"
              value={selectedTime}
              onChange={(e) => {
                if (e.target.value !== "Year" && selectedView === "Month") {
                  setSelectedView("Day");
                }
                setSelectedTime(e.target.value);
              }}
            >
              <option value="Month">Kuukausi</option>
              <option value="Year">Vuosi</option>
            </select>
          </div>
        </div>{" "}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:gap-8 lg:grid-cols-2 items-center text-center ">
        <div className={graphContainerClass}>
          <NewEntriesCountChart
            EntriesData={EntriesData}
            chartShowDate={chartShowDate}
            selectedTime={selectedTime}
            selectedView={selectedView}
          />
        </div>
        <div className={graphContainerClass}>
          <AvgExcerciseTimeChart
            EntriesData={EntriesData}
            chartShowDate={chartShowDate}
            selectedTime={selectedTime}
            selectedView={selectedView}
          />
        </div>
        <div className={graphContainerClass}>
          <NewStudentsChart
            newStudentsData={newStudentsData}
            chartShowDate={chartShowDate}
            selectedTime={selectedTime}
            selectedView={selectedView}
          />
        </div>
        <div className={graphContainerClass}>
          <AvgSickdaysChart
            EntriesData={EntriesData}
            chartShowDate={chartShowDate}
            selectedTime={selectedTime}
            selectedView={selectedView}
          />
        </div>
      </div>
      <div className="flex gap-8 justify-center flex-wrap">
        <div className="flex flex-col gap-2 items-center justify-center bg-bgSecondary p-4 rounded-md border-borderPrimary border-2 w-48">
          <p className=""> Opiskelijoiden määrä:</p>{" "}
          <p className="text-xl text-primaryColor">{EntriesData.studentCount}</p>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center bg-bgSecondary p-4 rounded-md border-borderPrimary border-2 w-48">
          <p> Merkintöjen määrä:</p>{" "}
          <p className="text-xl text-primaryColor">{EntriesData.entryCount}</p>
        </div>
        <div className="flex flex-col gap-2 items-center justify-center bg-bgSecondary p-4 rounded-md border-borderPrimary border-2 w-48">
          <p> Urheiltu aika:</p>{" "}
          <p className="text-xl text-primaryColor">{EntriesData.exerciseTimeFormatted}</p>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;

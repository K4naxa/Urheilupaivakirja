import NewEntriesCountChart from "../../components/charts/StatisticsPage/NewEntriesCountChart";
import AvgExcerciseTimeChart from "../../components/charts/StatisticsPage/AvgExcerciseTimeChart";
import NewStudentsChart from "../../components/charts/StatisticsPage/NewStudentsChart";
import AvgSickdaysChart from "../../components/charts/StatisticsPage/AvgSickdaysChart";
import { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { addMonths, subMonths } from "date-fns";
import formatDate from "../../utils/formatDate";

function StatisticsPage() {
  const [chartShowDate, setChartShowDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState("Month");
  const [selectedView, setSelectedView] = useState("Day");
  const graphContainerClass =
    "flex flex-col gap-4 items-center justify-center bg-bgSecondary p-4 rounded-md border-borderPrimary border-2";
  return (
    <div>
      <div className="flex flex-col gap-8 m-4">
        <h1 className="text-2xl text-center">Tilastot</h1>

        <div className="flex gap-8 justify-center">
          <div className="flex flex-col text-center">
            {" "}
            <div className="text-textSecondary">
              {chartShowDate.getFullYear()}
            </div>
            <div className="w-full flex justify-center items-center mb-4">
              <p
                className="text-textPrimary hover:text-primaryColor hover:cursor-pointer select-none"
                onClick={() => {
                  setChartShowDate(subMonths(chartShowDate, 1));
                }}
              >
                <FiChevronLeft />
              </p>

              <p className="w-32 text-xl">
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
        <div className="grid grid-cols-1 gap-4 lg:gap-8 lg:grid-cols-3 items-center text-center ">
          <div>Opiskelijat: 0</div>
          <div>Urheiluajat: 0</div>
          <div>Merkinnät: 0</div>
        </div>
      </div>
    </div>
  );
}

export default StatisticsPage;

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import PractiseBoxes from "../../components/PractiseBoxes";
import HeatMap_Month from "../../components/Heatmaps/HeatMap_Month";
import HeatMap_Year from "../../components/Heatmaps/HeatMap_Year";
import RecentJournalEntries from "../../components/RecentJournalEntries";
import WorkoutIntensityChart from "../../components/WorkoutIntensityChart";
import trainingService from "../../services/trainingService";
import LoadingScreen from "../../components/LoadingScreen";
import { useMainContext } from "../../hooks/mainContext";
import formatDate from "../../utils/formatDate";
import { addMonths, subMonths } from "date-fns";

import {
  FiChevronLeft,
  FiChevronRight,
  FiBarChart,
  FiZap,
  FiBarChart2,
} from "react-icons/fi";

import { useJournalModal } from "../../hooks/useJournalModal";
import WeekDayActivity from "../../components/charts/WeekDayActivity";

function StudentHome() {
  const { showDate, setShowDate } = useMainContext();
  const { openBigModal } = useJournalModal();

  const {
    data: studentJournalData,
    isLoading: studentJournalDataLoading,
    error: studentJournalDataError,
    isSuccess,
  } = useQuery({
    queryKey: ["studentJournal"],
    queryFn: () => trainingService.getAllUserJournalEntries(),
    staleTime: 15 * 60 * 1000,
  });

  useEffect(() => {
    console.log("StudentJournalData fetched successfully");
  }, [isSuccess]);

  if (studentJournalDataLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingScreen />
      </div>
    );
  }

  if (studentJournalDataError) {
    return (
      <div className="flex justify-center items-center">
        <h1>Something went wrong</h1>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 w-full m-8  gap-8 overflow-x-auto bg-bgPrimary text-textPrimary">
      {/* first row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 grid-rows-1 w-full h-full">
        {/* left Side */}
        <div className="flex flex-col border border-borderPrimary p-4 bg-bgSecondary rounded-md text-center box-border">
          <div className="text-textSecondary">{showDate.getFullYear()}</div>
          <div className="w-full flex justify-center items-center mb-4">
            <p
              className="text-textPrimary hover:text-headerPrimary hover:cursor-pointer select-none"
              onClick={() => {
                setShowDate(subMonths(showDate, 1));
              }}
            >
              <FiChevronLeft />
            </p>
            <p className="w-24 text-lg">
              {formatDate(showDate, { month: "long" })}
            </p>
            <p
              className="text-textPrimary hover:text-headerPrimary hover:cursor-pointer select-none"
              onClick={() => {
                setShowDate(addMonths(showDate, 1));
              }}
            >
              <FiChevronRight />
            </p>
          </div>

          <div className="w-full flex justify-center">
            <HeatMap_Month journal={studentJournalData} />
          </div>
        </div>
        {/* rightSide */}
        <div className="lg:col-span-2 flex-col bg-bgSecondary p-4 rounded-md border border-borderPrimary">
          <div className="flex justify-between">
            <div>
              <div className="text-2xl font-medium flex gap-2">
                <p className="text-textSecondary">Huomenta</p>
                <p className="text-textPrimary"> Testi Käyttäjä</p>
              </div>
              <p className="text-textSecondary">
                Paras päivä aloittaa urheilu oli eilen
              </p>
            </div>
            <div className="flex gap-4">
              <button className="px-4 py-2 border border-borderPrimary rounded-md bg-headerPrimary text-white">
                <p onClick={() => openBigModal("new")} className="">
                  + Lisää harjoitus
                </p>
              </button>
            </div>
          </div>
          <div className=" mt-4">
            <RecentJournalEntries journal={studentJournalData} />
          </div>
        </div>
      </div>
      {/* second row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
        <div>
          <WeekDayActivity journal={studentJournalData} />
        </div>

        <div className="bg-bgSecondary w-full  p-4 rounded-md border border-borderPrimary"></div>
      </div>

      {/* thrid Row */}
      <div
        className="flex flex-col bg-bgSecondary
      p-4
        rounded-md"
      >
        <div className="flex justify-between">
          <div className="flex gap-2  mb-4 items-center">
            {" "}
            <p className="IconBox">
              <FiZap />
            </p>
            <p className="text-lg">Vuoden merkinnät</p>
          </div>
        </div>
        <HeatMap_Year journal={studentJournalData} />
      </div>
    </div>
  );
}

export default StudentHome;

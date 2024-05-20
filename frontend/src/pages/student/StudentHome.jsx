import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import PractiseBoxes from "../../components/PractiseBoxes";
import HeatMap_Month from "../../components/Heatmaps/HeatMap_Month";
import HeatMap_Year from "../../components/Heatmaps/HeatMap_Year";
import RecentJournalEntries from "../../components/RecentJournalEntries";
import WorkoutIntensityChart from "../../components/WorkoutIntensityChart";
import WorkoutActivityChart from "../../components/WorkoutActivityChart";
import trainingService from "../../services/trainingService";
import LoadingScreen from "../../components/LoadingScreen";
import { useMainContext } from "../../hooks/mainContext";
import formatDate from "../../utils/formatDate";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { addMonths, subMonths } from "date-fns";

import { FiZap } from "react-icons/fi";

function StudentHome() {
  const { showDate, setShowDate } = useMainContext();

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

  const CircleGraph = ({ percentage }) => {
    return (
      <div className="relative w-32 h-32  rounded-lg  flex items-center justify-center">
        <div
          className="inset-0 rounded-full w-24 h-24 flex items-center justify-center"
          style={{
            background: `conic-gradient(#4f46e5 ${percentage}%, #e5e7eb ${percentage}%)`,
          }}
        >
          <div className="w-20 h-20 flex rounded-full bg-blue-300 text-center justify-center items-center">
            {" "}
            <p className="text-2xl text-blue-800">{percentage}%</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 w-full m-8  gap-8 overflow-x-auto bg-bgkPrimary text-textPrimary">
      {/* first row */}
      <div className="grid grid-cols-3 gap-8 grid-rows-1 w-full">
        {/* left Side */}
        <div className="border border-borderPrimary p-4 bg-bgSecondary rounded-md">
          <div className="flex gap-4  mb-4 items-center">
            <p className="p-2 bg-headerPrimary text-white rounded-md text-lg">
              <FiZap />
            </p>{" "}
            <p className="text-lg">Kuukauden aktiivisuus</p>
          </div>
          <div className="">
            <HeatMap_Month journal={studentJournalData} />
          </div>
        </div>
        {/* rightSode */}
        <div className="col-span-2 flex-col bg-bgSecondary p-4 rounded-md border border-borderPrimary">
          <div className="flex justify-between">
            <div>
              <div className="text-2xl font-medium flex gap-2">
                <p className="text-textSecondary">Hello</p>
                <p className="text-textPrimary"> Testi Käyttäjä</p>
              </div>
              <p>Good morning today is the best day to excercise</p>
            </div>
            <div className="flex gap-4">
              <button className="w-24 py-2 border rounded-md">
                This Month
              </button>
              <button className="w-24 py-2 border rounded-md bg-headerPrimary text-white">
                + Add Excersice
              </button>
            </div>
          </div>
          <div className=" mt-4">
            <div className="p-2 rounded-md border ">
              <RecentJournalEntries journal={studentJournalData} />
            </div>
          </div>
        </div>
      </div>
      {/* second row */}
      <div className="grid grid-cols-2 gap-8 w-full">
        <div className="bg-bgSecondary rounded-md p-4 border border-borderPrimary">
          <WorkoutActivityChart journal={studentJournalData} />
        </div>
        <div className="bg-bgSecondary w-full  p-4 rounded-md border border-borderPrimary">
          <WorkoutActivityChart journal={studentJournalData} />
        </div>
      </div>

      {/* thrid Row */}
      <div className="w-full bg-bgSecondary p-4 rounded-md border border-borderPrimary">
        <div className="flex gap-4  mb-4 items-center">
          <p className="p-2 bg-headerPrimary text-white rounded-md text-lg">
            <FiZap />
          </p>{" "}
          <p className="text-lg">Vuoden aktiivisuus</p>
        </div>
        <HeatMap_Year journal={studentJournalData} />
      </div>
    </div>
  );
}

export default StudentHome;

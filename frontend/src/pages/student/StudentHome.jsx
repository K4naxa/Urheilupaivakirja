import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import HeatMap_Month from "../../components/Heatmaps/HeatMap_Month";
import HeatMap_Year from "../../components/Heatmaps/HeatMap_Year";
import RecentJournalEntries from "../../components/RecentJournalEntries";
import LoadingScreen from "../../components/LoadingScreen";
import { useMainContext } from "../../hooks/mainContext";
import formatDate from "../../utils/formatDate";
import {
  addMonths,
  eachDayOfInterval,
  endOfDay,
  endOfMonth,
  format,
  isSameMonth,
  startOfDay,
  startOfMonth,
  subMonths,
} from "date-fns";
import { StudentHeatmapTooltip } from "../../components/heatmap-tooltip/StudentHeatmapTooltip";
import {
  FiChevronLeft,
  FiChevronRight,
  FiZap,
  FiTrendingUp,
} from "react-icons/fi";

import { useJournalModal } from "../../hooks/useJournalModal";
import WeekDayActivity from "../../components/charts/WeekDayActivity";
import JournalActivityBar from "../../components/charts/JournalActivityBar";
import CourseComplitionBar from "../../components/charts/CourseComplitionBar";
import getMotivationQuoteOfTheDay from "../../utils/motivationQuotes";
import userService from "../../services/userService";

function StudentHome() {
  const { showDate, setShowDate } = useMainContext();
  const { openBigModal } = useJournalModal();

  const {
    data: studentData,
    isLoading: studentDataLoading,
    error: studentDataError,
    isSuccess,
  } = useQuery({
    queryKey: ["studentData"],
    queryFn: () => userService.getStudentData(),
    staleTime: 15 * 60 * 1000,
  });

  useEffect(() => {
    console.log("studentData fetched successfully");
  }, [isSuccess]);

  if (studentDataLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingScreen />
      </div>
    );
  }

  const formatHelloMessage = () => {
    const date = new Date();
    const hours = date.getHours();
    if (hours < 12) {
      return "Huomenta";
    } else if (hours < 18) {
      return "Iltapäivää";
    } else {
      return "Hyvää iltaa";
    }
  };

  const calcJournalActivity = () => {
    const monthStart = startOfDay(startOfMonth(showDate));
    const monthEnd = endOfDay(endOfMonth(showDate));
    const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

    let activeDaysInMonth = new Set();

    studentData.journal_entries.forEach((entry) => {
      const entryDate = new Date(entry.date);
      if (isSameMonth(entryDate, showDate)) {
        activeDaysInMonth.add(format(entryDate, "yyyy-MM-dd"));
      }
    });

    return (activeDaysInMonth.size / monthDays.length) * 100;
  };

  const calcJournalEntriesCount = () => {
    return studentData.journal_entries.length;
  };

  if (studentDataError) {
    return (
      <div className="flex justify-center items-center w-full">
        <h1>Something went wrong, try again later</h1>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 w-full m-2 lg:m-8 gap-4 lg:gap-8 overflow-x-auto bg-bgPrimary text-textPrimary">
      <StudentHeatmapTooltip />
      {/* first row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4  lg:gap-8 grid-rows-1 w-full h-full">
        {/* left Side */}
        <div className="flex flex-col border border-borderPrimary p-4 bg-bgSecondary rounded-md text-center box-border">
          <div className="text-textSecondary">{showDate.getFullYear()}</div>
          <div className="w-full flex justify-center items-center mb-4">
            <p
              className="text-textPrimary hover:text-primaryColor hover:cursor-pointer select-none"
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
              className="text-textPrimary hover:text-primaryColor hover:cursor-pointer select-none"
              onClick={() => {
                setShowDate(addMonths(showDate, 1));
              }}
            >
              <FiChevronRight />
            </p>
          </div>
          <div className="w-full flex justify-center">
            <HeatMap_Month journal={studentData.journal_entries} />
          </div>
        </div>

        {/* rightSide */}
        <div className="lg:col-span-2 flex-col bg-bgSecondary lg:p-4 rounded-md lg:border border-borderPrimary">
          {/* right hello messaage */}
          <div className="hidden lg:flex justify-between">
            <div className="">
              <div className="text-2xl font-medium flex gap-2">
                <p className="text-textSecondary">{formatHelloMessage()}</p>
                <p className="text-textPrimary">
                  {studentData.first_name} {studentData.last_name}
                </p>
              </div>
              <p className="text-textSecondary">
                {getMotivationQuoteOfTheDay()}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => openBigModal("new")}
                className="px-4 py-2 border border-borderPrimary rounded-md bg-primaryColor text-white
              hover:bg-hoverPrimary"
              >
                {`+ Uusi harjoitus`}
              </button>
            </div>
          </div>

          <div className=" lg:mt-4">
            <RecentJournalEntries journal={studentData.journal_entries} />
          </div>
        </div>
      </div>
      {/* second row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-8 w-full">
        <div>
          <WeekDayActivity journal={studentData.journal_entries} />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 bg-bgSecondary bg-transparent gap-4">
          <div className=" bg-bgSecondary border border-borderPrimary rounded-md p-4">
            <div className="flex gap-2 items-center">
              {" "}
              <p className="IconBox">
                <FiTrendingUp />
              </p>
              <p className="text-lg">Seuranta</p>
            </div>
            <div className=" grid grid-cols-2 h-full w-full items-center co">
              <div className="flex flex-col gap-4">
                <p className="font-medium ">Merkintä aktiivisuus: </p>
                <p className="text-textSecondary text-sm">
                  Viimeisin merkintä:{" "}
                  {format(studentData.journal_entries[0].date, "dd.MM.yyyy")}
                </p>
              </div>
              <JournalActivityBar percentage={calcJournalActivity()} />
            </div>
          </div>

          <div className="bg-bgSecondary border border-borderPrimary rounded-md p-4">
            <div className="flex gap-2 items-center">
              {" "}
              <p className="IconBox">
                <FiTrendingUp />
              </p>
              <p className="text-lg">Seuranta</p>
            </div>
            <div className="flex flex-col justify-center items-center">
              <CourseComplitionBar value={calcJournalEntriesCount()} />
            </div>
          </div>
        </div>
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
        <HeatMap_Year journal={studentData.journal_entries} />
      </div>
    </div>
  );
}

export default StudentHome;

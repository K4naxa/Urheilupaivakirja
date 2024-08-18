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
import trainingService from "../../services/trainingService";

function StudentHome() {
  const { showDate, setShowDate } = useMainContext();
  const { openBigModal } = useJournalModal();

  const {
    data: studentData,
    isLoading: studentDataLoading,
    error: studentDataError,
  } = useQuery({
    queryKey: ["studentData"],
    queryFn: () => userService.getStudentData(),
    staleTime: 15 * 60 * 1000,
  });

  const { data: courseSegments } = useQuery({
    queryKey: ["courseSegments"],
    queryFn: () => trainingService.getCourseSegments(),
    staleTime: 15 * 60 * 1000,
  });

  if (studentDataLoading || !courseSegments) {
    return (
      <div className="flex items-center justify-center">
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
      <div className="flex items-center justify-center w-full">
        <h1>Something went wrong, try again later</h1>
      </div>
    );
  }

  return (
    <div className="grid w-full grid-cols-1 gap-4 m-2 overflow-x-auto lg:m-8 lg:gap-8 bg-bgPrimary text-textPrimary">
      <StudentHeatmapTooltip />
      {/* first row */}
      <div className="grid w-full h-full grid-cols-1 grid-rows-1 gap-4 lg:grid-cols-3 lg:gap-8">
        {/* left Side */}
        <div className="box-border flex flex-col p-4 text-center border rounded-md border-borderPrimary bg-bgSecondary">
          <div className="text-textSecondary">{showDate.getFullYear()}</div>
          <div className="flex items-center justify-center w-full mb-4">
            <p
              className="select-none text-textPrimary hover:text-primaryColor hover:cursor-pointer"
              onClick={() => {
                setShowDate(subMonths(showDate, 1));
              }}
            >
              <FiChevronLeft />
            </p>
            <p className="w-32 text-2xl">
              {formatDate(showDate, { month: "long" })}
            </p>
            <p
              className="select-none text-textPrimary hover:text-primaryColor hover:cursor-pointer"
              onClick={() => {
                setShowDate(addMonths(showDate, 1));
              }}
            >
              <FiChevronRight />
            </p>
          </div>
          <div className="flex justify-center w-full">
            <HeatMap_Month journal={studentData.journal_entries} />
          </div>
        </div>

        {/* rightSide */}
        <div className="flex-col rounded-md lg:col-span-2 bg-bgSecondary lg:p-4 lg:border border-borderPrimary">
          {/* right hello messaage */}
          <div className="justify-between hidden lg:flex">
            <div className="">
              <div className="flex gap-2 text-2xl font-medium">
                <p className="text-textSecondary">{formatHelloMessage()}</p>
                <p className="text-textPrimary">
                  {studentData.first_name} {studentData.last_name[0]}.
                </p>
              </div>
              <p className="text-textSecondary">
                {getMotivationQuoteOfTheDay()}
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => openBigModal("new")}
                className="px-4 py-2 text-white border rounded-md border-borderPrimary bg-primaryColor hover:bg-hoverPrimary"
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
      <div className="grid w-full grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-8">
        <div>
          <WeekDayActivity journal={studentData.journal_entries} />
        </div>

        <div className="grid grid-cols-1 gap-4 bg-transparent sm:grid-cols-2 bg-bgSecondary">
          <div className="p-4 border rounded-md bg-bgSecondary border-borderPrimary">
            <div className="flex items-center gap-2">
              {" "}
              <p className="IconBox">
                <FiTrendingUp />
              </p>
              <p className="text-lg">Seuranta</p>
            </div>
            <div className="grid items-center w-full h-full grid-cols-2 co">
              <div className="flex flex-col gap-4">
                <p className="font-medium ">Merkintä aktiivisuus: </p>
                <p className="text-sm text-textSecondary">
                  Viimeisin merkintä:{" "}
                  {studentData.journal_entries.length > 0
                    ? format(studentData.journal_entries[0].date, "dd.MM.yyyy")
                    : "Ei merkintöjä"}
                </p>
              </div>
              <JournalActivityBar percentage={calcJournalActivity()} />
            </div>
          </div>

          <div className="p-4 border rounded-md bg-bgSecondary border-borderPrimary">
            <div className="flex items-center gap-2">
              {" "}
              <p className="IconBox">
                <FiTrendingUp />
              </p>
              <p className="text-lg">Seuranta</p>
            </div>
            <div className="flex flex-col items-center justify-center">
              <CourseComplitionBar
                student={studentData}
                courseSegments={courseSegments}
              />
            </div>
          </div>
        </div>
      </div>

      {/* thrid Row */}
      <div className="flex flex-col p-4 rounded-md bg-bgSecondary">
        <div className="flex justify-between">
          <div className="flex items-center gap-2 mb-4">
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

import { useQuery } from "@tanstack/react-query";
import { Tooltip } from "react-tooltip";
import { useState } from "react";
import HeatMap_Month from "../../components/heatmaps/HeatMap_Month";
import HeatMap_Year from "../../components/heatmaps/HeatMap_Year";
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

import { useBigModal } from "../../hooks/useBigModal";
import WeekDayActivity from "../../components/charts/WeekDayActivity";
import getMotivationQuoteOfTheDay from "../../utils/motivationQuotes";
import studentService from "../../services/studentService";
import courseService from "../../services/courseService";
import cc from "../../utils/cc";

function StudentHome() {
  const { showDate, setShowDate } = useMainContext();
  const { openBigModal } = useBigModal();
  const [tooltipContent, setTooltipContent] = useState(null);

  const {
    data: studentData,
    isLoading: studentDataLoading,
    error: studentDataError,
  } = useQuery({
    queryKey: ["studentData"],
    queryFn: () => studentService.getStudentData(),
    staleTime: 15 * 60 * 1000,
  });

  const {
    data: courseSegments,
    error: courseSegmentsError,
  } = useQuery({
    queryKey: ["courseSegments"],
    queryFn: () => courseService.getCourseSegments(),
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

    return Math.round((activeDaysInMonth.size / monthDays.length) * 100) || 0;
  };

  const renderProgressionBar = ({ student }) => {
    if (!courseSegments) return null;

    let unUsedEntires = student.total_entry_count || 0;

    const total_requirement = courseSegments.reduce(
      (acc, segment) => acc + segment.value,
      0
    );

    return (
      <div className="flex w-full h-5 gap-1">
        {courseSegments.map((segment, index) => {
          const segmentLength = (segment.value / total_requirement) * 100;
          let segmentProgression = Math.min(
            (unUsedEntires / segment.value) * 100,
            100
          );

          if (segmentProgression < 0) segmentProgression = 0;

          const TooltipInfo = {
            name: segment.name,
            requirement: segment.value,
            unUsedEntires: Math.min(Math.max(unUsedEntires, 0), segment.value),
            progression: Math.min(Math.max(segmentProgression, 0), 100),
          };

          unUsedEntires -= segment.value;

          return (
            <div
              key={index}
              className={cc(
                "h-full segment hover:cursor-pointer border border-borderPrimary rounded-xl clickableCourseSegment bg-bgGray"
              )}
              style={{ width: `${segmentLength}%` }}
              onClick={() => setTooltipContent(TooltipInfo)}
              onMouseLeave={() => setTooltipContent(null)}
            >
              <div
                className={cc(
                  "h-full bg-primaryColor flex justify-center relative rounded-xl shadow-md",
                  segmentProgression === 100 && "bg-green-500"
                )}
                style={{ width: `${segmentProgression}%` }}
              ></div>
            </div>
          );
        })}
      </div>
    );
  };

  const getSegmentTooltipContent = () => {
    console.log(tooltipContent);
    return (
      <>
        <div className="flex flex-col gap-2 p-2 w-42">
          <h3 className="font-bold text-center">{tooltipContent.name}</h3>
          <span>Suoritettu: {tooltipContent.progression}%</span>
          <span className="">
            Merkinnät: {tooltipContent.unUsedEntires} /{" "}
            {tooltipContent.requirement}
          </span>
        </div>
      </>
    );
  };

  if (studentDataError || courseSegmentsError) {
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
                onClick={() => openBigModal("newJournalEntry")}
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

        <div className="flex flex-col w-full h-full gap-4 p-4 border rounded-md bg-bgSecondary border-borderPrimary">
          {/* Header */}
          <div className="flex items-center gap-2">
            {" "}
            <p className="IconBox">
              <FiTrendingUp />
            </p>
            <div className="flex flex-col ">
              {" "}
              <p className="pb-0 mb-0 text-lg leading-none ">Seuranta</p>
              <small>Seuraa aktiivisuuttasi, sekä kurssiesi edistymistä</small>
            </div>
          </div>

          <div className="flex flex-col justify-around w-full h-full gap-4 ">
            {/* Kuukauden aktiivusus container */}

            <div className="p-2 py-4 border rounded-md border-borderPrimary">
              <h3 className="mb-1">Kuukauden merkintä aktiivisuus:</h3>
              {/* progressbar */}
              <div className="relative w-full h-5 border rounded-xl border-borderPrimary bg-bgGray">
                <div
                  className="flex justify-center h-full align-middle bg-green-500 shadow-md rounded-xl"
                  style={{ width: `${calcJournalActivity()}%` }}
                >
                  <small className="absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 text-textPrimary ">
                    {calcJournalActivity()} %
                  </small>
                </div>
              </div>
              <small className="text-textSecondary">
                Viimeisin merkintä:{" "}
                {studentData.journal_entries.length > 0
                  ? format(studentData.journal_entries[0].date, "dd.MM.yyyy")
                  : "Ei merkintöjä"}
              </small>
            </div>
            <div className="p-2 py-4 border rounded-md border-borderPrimary">
              <h3 className="mb-1">Kurssin suoritus:</h3>
              {renderProgressionBar({ student: studentData })}
              <small className="text-textSecondary">
                Olet suorittanut kurssistasi: {studentData.total_entry_count} /{" "}
                {courseSegments.reduce(
                  (acc, segment) => acc + segment.value,
                  0
                )}
              </small>
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
        <HeatMap_Year
          journal={studentData.journal_entries}
          showDate={showDate}
        />
      </div>

      <Tooltip
        id="segment-tooltip"
        anchorSelect=".clickableCourseSegment"
        className="z-10 border nice-shadow border-borderPrimary"
        place="bottom"
        openOnClick={true}
        opacity={1}
        offset="2"
        style={{
          backgroundColor: "rgb(var(--color-bg-secondary))",
          color: "rgb(var(--color-text-primary))",
          padding: "0.5rem",
        }}
      >
        {tooltipContent && getSegmentTooltipContent()}
      </Tooltip>
    </div>
  );
}

export default StudentHome;

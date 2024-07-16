import { useState, useMemo, useCallback, useEffect } from "react";
import publicService from "../../services/publicService.js";
import { useMainContext } from "../../hooks/mainContext.jsx";
import { useQuery } from "@tanstack/react-query";

import HeatMap_Year from "../../components/Heatmaps/HeatMap_Year.jsx";
import HeatMap_Month from "../../components/Heatmaps/HeatMap_Month.jsx";
import HeatMap_Weeks from "../../components//Heatmaps/HeatMap_Weeks.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";

import StudentMultiSelect from "../../components/multiSelect-search/StudentMultiSelect.jsx";
import SportsMultiSelect from "../../components/multiSelect-search/SportMultiSelect.jsx";

import { FiChevronDown, FiChevronLeft, FiChevronUp } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { IconContext } from "react-icons/lib";
import { addMonths, addWeeks, getWeek, subMonths, subWeeks } from "date-fns";
import formatDate from "../../utils/formatDate.ts";
import { Link } from "react-router-dom";
import userService from "../../services/userService.js";
import { TeacherHeatmapTooltip } from "../../components/heatmap-tooltip/TeacherHeatmapTooltip.jsx";
import CampusMultiSelect from "../../components/multiSelect-search/CampusMultiSelect.jsx";
import GroupMultiSelect from "../../components/multiSelect-search/GroupMultiSelect.jsx";
import cc from "../../utils/cc.js";

function TeacherHome() {
  const [showWeeks, setShowWeeks] = useState(true);
  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filteredStudents, setfilteredStudents] = useState([]);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedCampuses, setSelectedCampuses] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const { setShowDate } = useMainContext();

  // Course completion requirement for passing the course
  const COURSE_COMPLETION_REQUIREMENT = 300;

  const {
    data: studentsAndJournalsData,
    isLoading: studentsAndJournalsDataLoading,
    error: studentsAndJournalsDataError,
  } = useQuery({
    queryKey: ["studentsAndJournals"],
    queryFn: () => userService.getStudentsAndEntries(),
    staleTime: 30 * 60 * 1000, //30 minutes
  });

  const {
    data: optionsData,
    isLoading: optionsLoading,
    error: optionsError,
  } = useQuery({
    queryKey: ["options"],
    queryFn: () => publicService.getOptions(),
  });

  useEffect(() => {
    if (studentsAndJournalsData) {
      setfilteredStudents(studentsAndJournalsData);
    }
  }, [studentsAndJournalsData]);

  // filter students based on selected filters
  useEffect(() => {
    let newFilteredStudents = studentsAndJournalsData;

    if (selectedSports.length > 0) {
      newFilteredStudents = newFilteredStudents.filter((student) =>
        selectedSports.some((sport) => sport.label === student.sport_name)
      );
    }
    if (selectedCampuses.length > 0) {
      newFilteredStudents = newFilteredStudents.filter((student) =>
        selectedCampuses.some((campus) => campus.label === student.campus_name)
      );
    }
    if (selectedGroups.length > 0) {
      newFilteredStudents = newFilteredStudents.filter((student) =>
        selectedGroups.some((group) => group.label === student.group_identifier)
      );
    }

    if (selectedStudents.length > 0) {
      newFilteredStudents = newFilteredStudents.filter((journal) =>
        selectedStudents.some((student) => student.value === journal.user_id)
      );
    }

    setfilteredStudents(newFilteredStudents);
  }, [
    selectedStudents,
    selectedSports,
    selectedCampuses,
    selectedGroups,
    studentsAndJournalsData,
  ]);

  const options = useMemo(() => {
    if (optionsData) return optionsData;
    return { sports: [], student_groups: [], campuses: [] };
  }, [optionsData]);

  const countCourseProgression = (student) => {
    const total = student.journal_entries.length;
    let progression = total / COURSE_COMPLETION_REQUIREMENT;
    progression *= 100;

    if (progression > 100) return 100;
    return Math.round(progression);
  };

  // renders Progression bar that is placed at the bottom of the parent element. Length of the bar is determined by the progression value. If progression is 100% the bar color is changed to bgExercise (green)
  const renderProgressionBar = (progression) => {
    return (
      <div
        className={cc(
          "absolute bottom-0 left-0 h-1 bg-primaryColor",
          progression === 100 && "bg-bgExercise"
        )}
        style={{ width: `${progression}%` }}
      ></div>
    );
  };

  const RenderWeeks = ({ journals }) => {
    const { showDate, setShowDate } = useMainContext();

    if (journals?.length === 0) {
      return <div className="flex justify-center w-full">Ei hakutuloksia</div>;
    } else
      return (
        <div className="flex flex-col justify-center">
          {/* Date controls */}
          <div className="flex w-full flex-col text-center mb-4">
            <h2 className="text-textSecondary">{showDate.getFullYear()}</h2>
            <div className="hover: flex justify-center gap-4">
              <button
                className="hover:text-primaryColor"
                onClick={() => {
                  setShowDate(subWeeks(showDate, 1));
                }}
              >
                <IconContext.Provider
                  value={{ className: "hover:text-primaryColor" }}
                >
                  <FiChevronLeft />
                </IconContext.Provider>
              </button>
              <p className="text-xl">{getWeek(showDate)}</p>
              <button
                className="hover:text-primaryColor"
                onClick={() => {
                  setShowDate(addWeeks(showDate, 1));
                }}
              >
                <IconContext.Provider
                  value={{ className: "hover:text-primaryColor" }}
                >
                  <FiChevronRight />
                </IconContext.Provider>
              </button>
            </div>
          </div>
          {/* Student list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {journals?.map((journal) => {
              const progression = countCourseProgression(journal);
              return (
                <div
                  key={journal.user_id}
                  className="flex flex-col rounded-md p-4 border border-borderPrimary hover:bg-hoverDefault w-full relative"
                  id="studentCard"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Link
                      to={`/opettaja/opiskelijat/${journal.user_id}`}
                      className="flex gap-1 hover:cursor-pointer hover:underline"
                    >
                      <p>{journal.first_name}</p>
                      <p>{journal.last_name}</p>
                    </Link>
                    <HeatMap_Weeks journal={journal} />
                  </div>
                  {/* Progress bar */}
                  {renderProgressionBar(progression)}
                </div>
              );
            })}
          </div>
        </div>
      );
  };

  const RenderMonths = ({ journals }) => {
    const { showDate, setShowDate } = useMainContext();

    if (journals.length === 0) {
      return <div className="flex justify-center w-full">Ei hakutuloksia</div>;
    } else
      return (
        <div className="flex flex-col justify-center">
          <div className="flex flex-col text-center mb-8">
            <h2 className="text-textSecondary">{showDate.getFullYear()}</h2>
            <div className="hover: flex justify-center gap-4">
              <button
                className="hover:underline"
                onClick={() => {
                  setShowDate(subMonths(showDate, 1));
                }}
              >
                <IconContext.Provider
                  value={{ className: "hover:text-primaryColor" }}
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
                  setShowDate(addMonths(showDate, 1));
                }}
              >
                <IconContext.Provider
                  value={{ className: "hover:text-primaryColor" }}
                >
                  <FiChevronRight />
                </IconContext.Provider>
              </button>
            </div>
          </div>
          <div className="flex flex-wrap lg:gap-8 gap-4 justify-center">
            {journals.map((journal) => {
              const progression = countCourseProgression(journal);
              return (
                <div
                  key={journal.user_id}
                  className="flex flex-col gap-2 w-64 rounded-md border border-borderPrimary p-4 hover:bg-hoverDefault relative"
                  id="studentCard"
                >
                  <Link
                    to={`/opettaja/opiskelijat/${journal.user_id}`}
                    className="flex flex-col pt-2 "
                  >
                    <p className="text-lg text-center hover:cursor-pointer hover:underline">
                      {journal.first_name} {journal.last_name}
                    </p>
                  </Link>
                  <HeatMap_Month journal={journal} />
                  {renderProgressionBar(progression)}
                </div>
              );
            })}
          </div>
        </div>
      );
  };

  // RenderYears component
  const RenderYears = ({ journals }) => {
    const { showDate, setShowDate } = useMainContext();

    const handlePreviousYearClick = (e) => {
      e.preventDefault();
      const newDate = new Date(showDate);
      newDate.setFullYear(
        showDate.getFullYear() - 1,
        showDate.getMonth(),
        showDate.getDate()
      );
      setShowDate(newDate);
    };

    const handleNextYearClick = (e) => {
      e.preventDefault();
      const newDate = new Date(showDate);
      newDate.setFullYear(
        showDate.getFullYear() + 1,
        showDate.getMonth(),
        showDate.getDate()
      );

      setShowDate(newDate);
    };

    if (journals.length === 0) {
      return <div className="flex justify-center w-full">Ei hakutuloksia</div>;
    } else
      return (
        <div className="flex flex-col justify-center w-full">
          <div className="flex flex-col text-center mb-8">
            <div className="hover: flex justify-center gap-4">
              <button
                className="hover:text-primaryColor"
                onClick={handlePreviousYearClick}
              >
                <FiChevronLeft />
              </button>
              <p className="text-xl">{showDate.getFullYear()}</p>
              <button
                className="hover:text-primaryColor"
                onClick={handleNextYearClick}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
          <div className="flex flex-col lg:gap-8 gap-4 justify-center overflow-x-hidden">
            {journals.map((journal) => {
              const progression = countCourseProgression(journal);
              return (
                <div
                  key={journal.user_id}
                  className="flex flex-col relative gap-2 p-4 rounded-md  border
                   border-borderPrimary hover:bg-hoverDefault"
                  id="studentCard"
                >
                  <div className="flex gap-4  leading-none items-end p-2">
                    <Link
                      to={`/opettaja/opiskelijat/${journal.user_id}`}
                      className="text-lg text-center leading-none hover:cursor-pointer hover:underline"
                    >
                      {journal.first_name} {journal.last_name}
                    </Link>

                    <p className="text-textSecondary">
                      Toimipiste: {journal.campus}
                    </p>
                    <p className="text-textSecondary">ryhmä: {journal.group}</p>
                    <p className="flex text-textSecondary">
                      Laji: {journal.sport}
                    </p>
                  </div>
                  <HeatMap_Year journal={journal} />
                  {renderProgressionBar(progression)}
                </div>
              );
            })}
          </div>
        </div>
      );
  };

  const handleFilterReset = useCallback(() => {
    setSelectedStudents([]);
    setSelectedSports([]);
    setSelectedCampuses([]);
    setSelectedGroups([]);
    setShowDate(new Date());
  }, [setShowDate]);

  if (studentsAndJournalsDataLoading) {
    return <LoadingScreen />;
  } else
    return (
      <div className="flex flex-col gap-8 lg:m-8 text-textPrimary">
        <TeacherHeatmapTooltip />

        <div
          className="flex flex-col w-full mx-auto
          bg-bgSecondary items-center justify-around
           rounded-md p-4 gap-8 border border-borderPrimary"
        >
          {/* Aika filtteri */}
          <div className="flex text-textSecondary text-sm justify-center">
            <p
              onClick={() => {
                setShowWeeks(true);
                setShowMonths(false);
                setShowYears(false);
              }}
              className={`cursor-pointer mx-2 ${showWeeks && "text-primaryColor border-b border-primaryColor"}`}
            >
              Viikko
            </p>
            <p
              onClick={() => {
                setShowWeeks(false);
                setShowMonths(true);
                setShowYears(false);
              }}
              className={`cursor-pointer mx-2 ${showMonths && "text-primaryColor border-b border-primaryColor"}`}
            >
              Kuukausi
            </p>
            <p
              onClick={() => {
                setShowWeeks(false);
                setShowMonths(false);
                setShowYears(true);
              }}
              className={`cursor-pointer mx-2 ${showYears && "text-primaryColor border-b border-primaryColor"}`}
            >
              Vuosi
            </p>
          </div>

          <div className="hidden lg:flex flex-wrap justify-center w-full items-center gap-2 lg:gap-8">
            <StudentMultiSelect
              studentArray={studentsAndJournalsData}
              selectedStudents={selectedStudents}
              setSelectedStudents={setSelectedStudents}
              filter={selectedStudents}
            />
            <SportsMultiSelect
              sportsArray={options.sports}
              selectedSports={selectedSports}
              setSelectedSports={setSelectedSports}
              filter={selectedSports}
            />
            <CampusMultiSelect
              campusArray={options.campuses}
              selectedCampuses={selectedCampuses}
              setSelectedCampuses={setSelectedCampuses}
              filter={selectedCampuses}
            />
            <GroupMultiSelect
              groupArray={options.student_groups}
              selectedGroups={selectedGroups}
              setSelectedGroups={setSelectedGroups}
              filter={selectedGroups}
            />

            <div className="flex lg:gap-8 justify-center text-sm">
              <button
                className="Button bg-btnGray hover:bg-hoverGray"
                onClick={handleFilterReset}
              >
                Nollaa
              </button>
            </div>
          </div>

          {/* filtres for mobile  */}
          <div className="flex flex-col lg:hidden w-full">
            <div
              className="flex gap-8 text-textSecondary w-full py-2 border-b border-borderPrimary
              justify-center items-center cursor-pointer select-none"
              onClick={() => {
                setShowMobileFilters(!showMobileFilters);
              }}
            >
              {showMobileFilters ? "Piilota suodattimet" : "Näytä suodattimet"}
              {showMobileFilters ? <FiChevronUp /> : <FiChevronDown />}
            </div>

            {showMobileFilters && (
              <div
                className={cc(
                  "grid lg:hidden w-full items-center gap-2 lg:gap-8"
                )}
              >
                <StudentMultiSelect
                  studentArray={studentsAndJournalsData}
                  selectedStudents={selectedStudents}
                  setSelectedStudents={setSelectedStudents}
                  filter={selectedStudents}
                />
                <SportsMultiSelect
                  sportsArray={options.sports}
                  selectedSports={selectedSports}
                  setSelectedSports={setSelectedSports}
                  filter={selectedSports}
                />
                <CampusMultiSelect
                  campusArray={options.campuses}
                  selectedCampuses={selectedCampuses}
                  setSelectedCampuses={setSelectedCampuses}
                  filter={selectedCampuses}
                />
                <GroupMultiSelect
                  groupArray={options.student_groups}
                  selectedGroups={selectedGroups}
                  setSelectedGroups={setSelectedGroups}
                  filter={selectedGroups}
                />

                <div className="flex lg:gap-8 justify-center text-sm">
                  <button
                    className="Button bg-btnGray hover:bg-hoverGray"
                    onClick={handleFilterReset}
                  >
                    Nollaa
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* student list */}
        {/* <div
          id="studentList"
          className="flex lg:ml-72 gap-8 rounded-md bg-bgSecondary p-4 "
        > */}
        <div
          id="studentList"
          className="flex w-full gap-8 rounded-md bg-bgSecondary p-4 justify-center border border-borderPrimary"
        >
          {showWeeks && <RenderWeeks journals={filteredStudents} />}
          {showMonths && <RenderMonths journals={filteredStudents} />}
          {showYears && <RenderYears journals={filteredStudents} />}
        </div>
      </div>
    );
}
export default TeacherHome;

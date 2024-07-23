import { useState, useMemo, useCallback, useEffect } from "react";
import publicService from "../../services/publicService.js";
import { useMainContext } from "../../hooks/mainContext.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import HeatMap_Year from "../../components/Heatmaps/HeatMap_Year.jsx";
import HeatMap_Month from "../../components/Heatmaps/HeatMap_Month.jsx";
import HeatMap_Weeks from "../../components//Heatmaps/HeatMap_Weeks.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";

import StudentMultiSelect from "../../components/multiSelect-search/StudentMultiSelect.jsx";
import SportsMultiSelect from "../../components/multiSelect-search/SportMultiSelect.jsx";

import { FiChevronDown, FiChevronLeft, FiChevronUp } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { IconContext } from "react-icons/lib";
import {
  addMonths,
  addWeeks,
  endOfWeek,
  getWeek,
  set,
  startOfDay,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import formatDate from "../../utils/formatDate.ts";
import { Link } from "react-router-dom";
import userService from "../../services/userService.js";
import { TeacherHeatmapTooltip } from "../../components/heatmap-tooltip/TeacherHeatmapTooltip.jsx";
import CampusMultiSelect from "../../components/multiSelect-search/CampusMultiSelect.jsx";
import GroupMultiSelect from "../../components/multiSelect-search/GroupMultiSelect.jsx";
import cc from "../../utils/cc.js";

function TeacherHome() {
  const queryClient = useQueryClient();
  const [showWeeks, setShowWeeks] = useState(true);
  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);

  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filteredStudents, setFilteredStudents] = useState([]);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedSports, setSelectedSports] = useState([]);
  const [selectedCampuses, setSelectedCampuses] = useState([]);
  const [selectedGroups, setSelectedGroups] = useState([]);

  const [selectedSorting, setSelectedSorting] = useState("default");

  const { setShowDate } = useMainContext();

  // Course completion requirement for passing the course
  const COURSE_COMPLETION_REQUIREMENT = 300;

  // all Students and their journals
  const {
    data: studentsAndJournalsData,
    isLoading: studentsAndJournalsDataLoading,
  } = useQuery({
    queryKey: ["studentsAndJournals"],
    queryFn: () => userService.getStudentsAndEntries(),
    staleTime: 30 * 60 * 1000, //30 minutes
  });

  // Only pinned students where the user id == pinner_user_id
  const { data: pinnedStudentsData } = useQuery({
    queryKey: ["pinnedStudents"],
    queryFn: () => userService.getPinnedStudents(),
    staleTime: 30 * 60 * 1000, //30 minutes
  });

  // all  sports / campuses / student groups for filtering
  const { data: optionsData } = useQuery({
    queryKey: ["options"],
    queryFn: () => publicService.getOptions(),
  });

  const options = useMemo(() => {
    if (optionsData) return optionsData;
    return { sports: [], student_groups: [], campuses: [] };
  }, [optionsData]);

  // Calculating available options for each filter type
  const availableOptions = useMemo(() => {
    if (!studentsAndJournalsData) return;

    const getAvailableOptions = (filterType) => {
      let newFilteredStudents = studentsAndJournalsData;

      if (filterType !== "students" && selectedStudents.length > 0) {
        newFilteredStudents = newFilteredStudents.filter((journal) =>
          selectedStudents.some((student) => student.value === journal.user_id)
        );
      }
      if (filterType !== "sports" && selectedSports.length > 0) {
        newFilteredStudents = newFilteredStudents.filter((student) =>
          selectedSports.some((sport) => sport.label === student.sport_name)
        );
      }
      if (filterType !== "campuses" && selectedCampuses.length > 0) {
        newFilteredStudents = newFilteredStudents.filter((student) =>
          selectedCampuses.some(
            (campus) => campus.label === student.campus_name
          )
        );
      }
      if (filterType !== "groups" && selectedGroups.length > 0) {
        newFilteredStudents = newFilteredStudents.filter((student) =>
          selectedGroups.some(
            (group) => group.label === student.group_identifier
          )
        );
      }

      return newFilteredStudents;
    };

    const countStudents = (filteredStudents, key) => {
      return filteredStudents.reduce((acc, student) => {
        const keyValue = student[key];
        if (acc[keyValue]) {
          acc[keyValue]++;
        } else {
          acc[keyValue] = 1;
        }
        return acc;
      }, {});
    };

    const formatOptions = (countObject) => {
      return Object.keys(countObject).map((name) => ({
        name,
        studentCount: countObject[name],
      }));
    };

    const availableSportsCount = countStudents(
      getAvailableOptions("sports"),
      "sport_name"
    );
    const availableCampusesCount = countStudents(
      getAvailableOptions("campuses"),
      "campus_name"
    );
    const availableGroupsCount = countStudents(
      getAvailableOptions("groups"),
      "group_identifier"
    );

    return {
      sports: formatOptions(availableSportsCount),
      campuses: formatOptions(availableCampusesCount),
      groups: formatOptions(availableGroupsCount),
    };
  }, [
    selectedStudents,
    selectedSports,
    selectedCampuses,
    selectedGroups,
    studentsAndJournalsData,
  ]);

  // Sorting function for students.
  // Default sorting is based on first name, if the student is pinned, they are placed first.
  // Other sorting options are based on the selected value.
  // If the selected value is 1, the sorting is done in ascending order, if the selected value is -1, the sorting is done in descending order.
  const sortingFunctions = {
    default: (a, b) => {
      const isAPinned = pinnedStudentsData?.some(
        (pinnedStudent) => pinnedStudent.pinned_user_id === a.user_id
      );
      const isBPinned = pinnedStudentsData?.some(
        (pinnedStudent) => pinnedStudent.pinned_user_id === b.user_id
      );

      if (isAPinned && !isBPinned) {
        return -1;
      } else if (!isAPinned && isBPinned) {
        return 1;
      } else {
        return a.first_name.localeCompare(b.first_name);
      }
    },
    name1: (a, b) => a.first_name.localeCompare(b.first_name),
    name2: (a, b) => b.first_name.localeCompare(a.first_name),
    sport1: (a, b) => a.sport_name.localeCompare(b.sport_name),
    sport2: (a, b) => b.sport_name.localeCompare(a.sport_name),
    group1: (a, b) => a.group_identifier.localeCompare(b.group_identifier),
    group2: (a, b) => b.group_identifier.localeCompare(a.group_identifier),
    campus1: (a, b) => a.campus_name.localeCompare(b.campus_name),
    campus2: (a, b) => b.campus_name.localeCompare(a.campus_name),
    progression1: (a, b) =>
      countCourseProgression(b) - countCourseProgression(a),
    progression2: (a, b) =>
      countCourseProgression(a) - countCourseProgression(b),
  };

  // filter and sort students based on selected filters
  useEffect(() => {
    if (!studentsAndJournalsData || !pinnedStudentsData) return;

    let newFilteredStudents = [...studentsAndJournalsData];

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
      newFilteredStudents = newFilteredStudents.filter((student) =>
        selectedStudents.some((selected) => selected.value === student.user_id)
      );
    }

    if (sortingFunctions[selectedSorting]) {
      newFilteredStudents.sort(sortingFunctions[selectedSorting]);
    }

    setFilteredStudents(newFilteredStudents);
  }, [
    selectedStudents,
    selectedSports,
    selectedCampuses,
    selectedGroups,
    studentsAndJournalsData,
    pinnedStudentsData,
    selectedSorting,
    showMobileFilters,
  ]);

  const countCourseProgression = (student) => {
    const total = student.journal_entries.length;
    let progression = total / COURSE_COMPLETION_REQUIREMENT;
    progression *= 100;

    if (progression > 100) return 100;
    return Math.round(progression * 100) / 100;
  };

  // renders Progression bar that is placed at the bottom of the parent element. Length of the bar is determined by the progression value. If progression is 100% the bar color is changed to bgExercise (green)
  const renderProgressionBar = (progression) => {
    return (
      <div
        className={cc(
          "absolute bottom-0 left-0 h-1",
          progression < 100 && "bg-primaryColor",
          progression === 100 && "bg-bgExercise"
        )}
        style={{ width: `${progression}%` }}
      ></div>
    );
  };
  const renderFavouriteMark = (journal) => {
    let isPinned = false;
    if (pinnedStudentsData) {
      isPinned = pinnedStudentsData.find(
        (pinnedStudent) => pinnedStudent.pinned_user_id === journal.user_id
      );
    }

    const handlePinClick = async () => {
      if (isPinned) {
        await userService.unpinStudent(journal.user_id).then(() => {
          queryClient.invalidateQueries("pinnedStudents");
        });
      } else {
        await userService.pinStudent(journal.user_id).then(() => {
          queryClient.invalidateQueries("pinnedStudents");
        });
      }
    };

    return (
      <div
        className={cc(
          "absolute -top-2 -left-2 h-4 w-4 rounded-sm cursor-pointer group-hover/studentCard:border group-hover/studentCard:border-yellow-500",
          isPinned ? "bg-yellow-500" : null
        )}
        onClick={() => handlePinClick()}
      ></div>
    );
  };

  const renderSortingSelect = () => {
    return (
      <div className="flex flex-col md:absolute right-0 mt-4 md:mt-0">
        <label htmlFor="sorting" className="px-2 text-xs text-textSecondary">
          Järjestys:
        </label>
        <select
          name="sorting"
          id="sortingSelect"
          value={selectedSorting}
          className="bg-bgSecondary border border-borderPrimary text-textSecondary
               p-1 rounded-md hover:cursor-pointer "
          onChange={(e) => setSelectedSorting(e.target.value)}
        >
          <option value="default">Oletus</option>
          <option value="name1">Nimi A-Ö</option>
          <option value="name2">Nimi Ö-A</option>
          <option value="sport1">Laji A-Ö</option>
          <option value="sport2">Laji Ö-A</option>
          <option value="group1">Ryhmä A-Ö</option>
          <option value="group2">Ryhmä Ö-A</option>
          <option value="campus1">Toimipaikka A-Ö</option>
          <option value="campus2">Toimipaikka Ö-A</option>

          <option value="progression1">Edistyminen ^</option>
          <option value="progression2">Edistyminen vähiten</option>
        </select>
      </div>
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
          <div className="flex w-full flex-col text-center mb-4 relative">
            <h2 className="text-textSecondary">{showDate.getFullYear()}</h2>
            <h2 className="text-textSecondary">
              {formatDate(startOfWeek(showDate, { weekStartsOn: 1 }), {
                day: "numeric",
              })}
              {". "}
              {formatDate(startOfWeek(showDate, { weekStartsOn: 1 }), {
                month: "long",
              })}{" "}
              <span> - </span>
              {formatDate(endOfWeek(showDate, { weekStartsOn: 1 }), {
                day: "numeric",
              })}
              {". "}
              {formatDate(endOfWeek(showDate, { weekStartsOn: 1 }), {
                month: "long",
              })}
            </h2>

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
            {renderSortingSelect()}
          </div>
          {/* Student list */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {journals?.map((journal) => {
              const progression = countCourseProgression(journal);
              return (
                <div
                  key={journal.user_id}
                  className="flex flex-col rounded-md p-2 border border-borderPrimary hover:bg-hoverDefault w-full relative overflow-hidden group/studentCard"
                  id="studentCard"
                >
                  {renderFavouriteMark(journal)}
                  <div className="flex-col items-center justify-between gap-2">
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
          <div className="flex flex-col text-center mb-8 relative">
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
            {renderSortingSelect()}
          </div>
          <div className="flex flex-wrap lg:gap-8 gap-4 justify-center">
            {journals.map((journal) => {
              const progression = countCourseProgression(journal);
              return (
                <div
                  key={journal.user_id}
                  className="flex flex-col gap-2 w-64 rounded-md border border-borderPrimary p-4 hover:bg-hoverDefault relative overflow-hidden group/studentCard"
                  id="studentCard"
                >
                  {renderFavouriteMark(journal)}
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
          <div className="flex flex-col text-center mb-8 relative">
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
            {renderSortingSelect()}
          </div>
          <div className="flex flex-col lg:gap-8 gap-4 justify-center overflow-x-hidden">
            {journals.map((journal) => {
              const progression = countCourseProgression(journal);
              return (
                <div
                  key={journal.user_id}
                  className="flex flex-col relative gap-2 p-4 rounded-md  border overflow-hidden group/studentCard
                   border-borderPrimary hover:bg-hoverDefault"
                  id="studentCard"
                >
                  {renderFavouriteMark(journal)}
                  <div className="flex flex-wrap gap-4  leading-none items-end p-2">
                    <Link
                      to={`/opettaja/opiskelijat/${journal.user_id}`}
                      className="text-lg text-center leading-none hover:cursor-pointer hover:underline"
                    >
                      {journal.first_name} {journal.last_name}
                    </Link>

                    <p className="text-textSecondary">
                      Toimipiste: {journal.campus_name}
                    </p>
                    <p className="text-textSecondary">
                      ryhmä: {journal.group_identifier}
                    </p>
                    <p className="flex text-textSecondary">
                      Laji: {journal.sport_name}
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
          <div className="flex w-full text-sm justify-center relative">
            <div className="text-textSecondary text-sm justify-center relative flex">
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
          </div>

          <div className="hidden text-sm lg:flex  flex-wrap justify-center w-full items-center gap-2 lg:gap-8">
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
              availableSports={availableOptions.sports}
            />
            <CampusMultiSelect
              campusArray={options.campuses}
              selectedCampuses={selectedCampuses}
              setSelectedCampuses={setSelectedCampuses}
              availableCampuses={availableOptions.campuses}
            />
            <GroupMultiSelect
              groupArray={options.student_groups}
              selectedGroups={selectedGroups}
              setSelectedGroups={setSelectedGroups}
              availableGroups={availableOptions.groups}
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
                  availableSports={availableOptions.sports}
                />
                <CampusMultiSelect
                  campusArray={options.campuses}
                  selectedCampuses={selectedCampuses}
                  setSelectedCampuses={setSelectedCampuses}
                  availableCampuses={availableOptions.campuses}
                />
                <GroupMultiSelect
                  groupArray={options.student_groups}
                  selectedGroups={selectedGroups}
                  setSelectedGroups={setSelectedGroups}
                  availableGroups={availableOptions.groups}
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

import React, { useState, useMemo, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import HeatMap_Year from "../../components/heatmaps/HeatMap_Year.jsx";
import HeatMap_Month_teacher from "../../components/heatmaps/HeatMap_Month_teacher.jsx";
import HeatMap_Weeks from "../../components//heatmaps/HeatMap_Weeks.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";

import { Tooltip } from "react-tooltip";

import StudentMultiSelect from "../../components/multiselect-search/StudentMultiSelect.jsx";
import SportsMultiSelect from "../../components/multiselect-search/SportMultiSelect.jsx";

import RenderFavouriteMark from "../../components/RenderFavouriteMark.jsx";

import { FiChevronDown, FiChevronLeft, FiChevronUp } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { IconContext } from "react-icons/lib";

import {
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  getWeek,
  isSameYear,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import formatDate from "../../utils/formatDate.ts";
import { Link } from "react-router-dom";
import studentService from "../../services/studentService.js";
import courseService from "../../services/courseService.js";
import miscService from "../../services/miscService.js";

import { TeacherHeatmapTooltip } from "../../components/heatmap-tooltip/TeacherHeatmapTooltip.jsx";
import CampusMultiSelect from "../../components/multiselect-search/CampusMultiSelect.jsx";
import GroupMultiSelect from "../../components/multiselect-search/GroupMultiSelect.jsx";
import cc from "../../utils/cc.js";

import { useToast } from "../../hooks/toast-messages/useToast.jsx";

function TeacherHome() {
  const queryClient = useQueryClient();
  const { addToast } = useToast();

  // Heatmaps for weeks, months and years in memoized components for performance
  const HeatMap_Weeks_Memoized = React.memo(HeatMap_Weeks);
  const HeatMap_Month_Memoized = React.memo(HeatMap_Month_teacher);
  const HeatMap_Year_Memoized = React.memo(HeatMap_Year);

  // all States for the component to reduce the amount of rerenders on multiple state changes
  const [state, setState] = useState(() => {
    const savedView = localStorage.getItem("teacherHomeShow") || "months";
    return {
      viewDataHandled: false,
      showWeeks: savedView === "weeks",
      showMonths: savedView === "months",
      showYears: savedView === "years",
      showMobileFilters: false,
      showDate: new Date(),
      filteredStudents: [],
      selectedStudents: [],
      selectedSports: [],
      selectedCampuses: [],
      selectedGroups: [],
      selectedSorting: "default",
      page: 1,
      studentsPerPage: 28,
      totalPages: 0,
      viewableStudents: [],
      viewableJournals: [],
    };
  });

  const handleViewChange = (view) => {
    setState((prevState) => ({
      ...prevState,
      showWeeks: view === "weeks",
      showMonths: view === "months",
      showYears: view === "years",
    }));
    localStorage.setItem("teacherHomeShow", view);
  };

  // get all students
  const { data: StudentsList, isPending: StudentsListLoading } = useQuery({
    queryKey: ["StudentsList"],
    queryFn: () => studentService.getStudents(),
  });

  // Course completion requirement for passing the course
  const { data: courseSegments } = useQuery({
    queryKey: ["courseSegments"],
    queryFn: () => courseService.getCourseSegments(),
    staleTime: 15 * 60 * 1000,
  });

  // Only pinned students where the user id == pinner_user_id
  const { data: pinnedStudentsData, isPending: pinnedStudentsLoading } =
    useQuery({
      queryKey: ["pinnedStudents"],
      queryFn: () => studentService.getPinnedStudents(),
      staleTime: 30 * 60 * 1000, //30 minutes
    });

  // all  sports / campuses / student groups for filtering
  const { data: optionsData, isPending: optionsDataLoading } = useQuery({
    queryKey: ["options"],
    queryFn: () => miscService.getGroupsSportsCampusesOptions(),
  });

  const options = useMemo(() => {
    if (optionsData) return optionsData;
    return { sports: [], student_groups: [], campuses: [] };
  }, [optionsData]);

  // useEffect to update the view when the StudentsList or pinnedStudentsData changes
  useEffect(() => {
    if (StudentsList && pinnedStudentsData) {
      handleViewUpdate(state);
    }
  }, [StudentsList, pinnedStudentsData]);

  // Function to update the view based on the selected filters and sorting
  // every new state change that effects the view is passed through this function
  const handleViewUpdate = (newStates) => {
    if (!StudentsList || !pinnedStudentsData) return;

    let newFilteredStudents = [...StudentsList];

    // Apply Filters
    if (newStates.selectedSports.length > 0) {
      newFilteredStudents = newFilteredStudents.filter((student) =>
        newStates.selectedSports.some(
          (sport) => sport.label === student.sport_name
        )
      );
    }
    if (newStates.selectedCampuses.length > 0) {
      newFilteredStudents = newFilteredStudents.filter((student) =>
        newStates.selectedCampuses.some(
          (campus) => campus.label === student.campus_name
        )
      );
    }
    if (newStates.selectedGroups.length > 0) {
      newFilteredStudents = newFilteredStudents.filter((student) =>
        newStates.selectedGroups.some((group) => group.label === student.name)
      );
    }
    if (newStates.selectedStudents.length > 0) {
      newFilteredStudents = newFilteredStudents.filter((student) =>
        newStates.selectedStudents.some(
          (selected) => selected.value === student.user_id
        )
      );
    }

    // Apply Sorting
    if (sortingFunctions[newStates.selectedSorting]) {
      newFilteredStudents.sort(sortingFunctions[newStates.selectedSorting]);
    }

    // Pagination
    const totalPages = Math.ceil(
      newFilteredStudents.length / newStates.studentsPerPage
    );
    const indexOfLastStudent = newStates.page * newStates.studentsPerPage;
    const indexOfFirstStudent = indexOfLastStudent - newStates.studentsPerPage;
    const viewableStudents = newFilteredStudents.slice(
      indexOfFirstStudent,
      indexOfLastStudent
    );

    function areArraysEqual(arr1, arr2) {
      if (arr1.length !== arr2.length) return false;
      for (let i = 0; i < arr1.length; i++) {
        if (JSON.stringify(arr1[i]) !== JSON.stringify(arr2[i])) {
          return false;
        }
      }
      return true;
    }

    // Fetch Journal Data
    const fetchJournals = async () => {
      // Check if the students or year have changed
      const hasStudentsChanged = !areArraysEqual(
        newStates.viewableStudents,
        viewableStudents
      );
      const hasYearChanged = !isSameYear(newStates.showDate, state.showDate);

      // If either students or year have changed, refetch data
      if (hasStudentsChanged || hasYearChanged) {
        const requestedStudents = viewableStudents.map((student) => ({
          ...student,
          journal_entries: undefined,
        }));

        try {
          const response = await studentService.getPaginatedStudentsData(
            requestedStudents,
            newStates.showDate
          );
          return response;
        } catch {
          addToast("Tietojen hakeminen epäonnistui", { style: "error" });
          return [];
        }
      } else {
        // Return cached data if no changes
        return newStates.viewableJournals;
      }
    };

    // Fetch journals and update state
    fetchJournals().then((viewableJournals) => {
      setState({
        ...newStates,
        filteredStudents: newFilteredStudents,
        totalPages,
        viewDataHandled: true,
        viewableStudents,
        viewableJournals,
      });
    });
  };

  const handleFilterReset = () => {
    handleViewUpdate({
      ...state,
      selectedStudents: [],
      page: 1,
      showDate: new Date(),
      selectedSports: [],
      selectedCampuses: [],
      selectedGroups: [],
      selectedSorting: "default",
      showMobileFilters: false,
    });
  };

  const RenderPaginationNav = () => {
    const handlePrevPage = () => {
      if (state.page > 1) {
        handleViewUpdate({ ...state, page: state.page - 1 });
        window.moveTo(0, 0);
      }
    };

    const handleNextPage = () => {
      if (state.page < state.totalPages) {
        handleViewUpdate({ ...state, page: state.page + 1 });
        window.moveTo(0, 0);
      }
    };

    return (
      <div className="flex items-center justify-center gap-4">
        <button
          className={cc(
            "Button bg-bgSecondary shadow-sm hover:border-hoverGray hover:bg-hoverDefault border-borderPrimary m-2 text-xs p-2 px-3 w-auto"
          )}
          onClick={handlePrevPage}
          disabled={state.page === 1}
        >
          Edellinen
        </button>
        <div className="">
          <p className="text-textSecondary">
            {state.page} / {state.totalPages}
          </p>
        </div>
        <button
          className={cc(
            "Button bg-bgSecondary shadow-sm hover:border-hoverGray hover:bg-hoverDefault border-borderPrimary m-2 text-xs p-2 px-3 w-auto"
          )}
          onClick={handleNextPage}
          disabled={state.page === state.totalPages}
        >
          Seuraava
        </button>
      </div>
    );
  };

  // Calculating available options for each filter type
  const availableOptions = useMemo(() => {
    if (!StudentsList) return;

    const getAvailableOptions = (filterType) => {
      let newFilteredStudents = StudentsList;

      if (filterType !== "students" && state.selectedStudents.length > 0) {
        newFilteredStudents = newFilteredStudents.filter((journal) =>
          state.selectedStudents.some(
            (student) => student.value === journal.user_id
          )
        );
      }
      if (filterType !== "sports" && state.selectedSports.length > 0) {
        newFilteredStudents = newFilteredStudents.filter((student) =>
          state.selectedSports.some(
            (sport) => sport.label === student.sport_name
          )
        );
      }
      if (filterType !== "campuses" && state.selectedCampuses.length > 0) {
        newFilteredStudents = newFilteredStudents.filter((student) =>
          state.selectedCampuses.some(
            (campus) => campus.label === student.campus_name
          )
        );
      }
      if (filterType !== "groups" && state.selectedGroups.length > 0) {
        newFilteredStudents = newFilteredStudents.filter((student) =>
          state.selectedGroups.some((group) => group.label === student.name)
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
      "name"
    );

    return {
      sports: formatOptions(availableSportsCount),
      campuses: formatOptions(availableCampusesCount),
      groups: formatOptions(availableGroupsCount),
    };
  }, [
    state.selectedStudents,
    state.selectedSports,
    state.selectedCampuses,
    state.selectedGroups,
    StudentsList,
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
    group1: (a, b) => a.name.localeCompare(b.name),
    group2: (a, b) => b.name.localeCompare(a.name),
    campus1: (a, b) => a.campus_name.localeCompare(b.campus_name),
    campus2: (a, b) => b.campus_name.localeCompare(a.campus_name),
    progression1: (a, b) => b.total_entry_count - a.total_entry_count,
    progression2: (a, b) => a.total_entry_count - b.total_entry_count,
  };

  // renders Progression bar that is placed at the bottom of the parent element. Length of the bar is determined by the progression value. If progression is 100% the bar color is changed to bgExercise (green)
  const renderProgressionBar = ({ student }) => {
    if (!courseSegments) return null;

    // student.total_entry_count
    let unUsedEntires = student.total_entry_count || 0;

    const total_requirement = courseSegments.reduce(
      (acc, segment) => acc + segment.value,
      0
    );

    return (
      <div className="absolute bottom-0 left-0 flex w-full h-1 gap-1">
        {/* Progress bar */}
        {courseSegments.map((segment, index) => {
          // Calculate the proportional width of the segment based on its value
          const segmentLength = (segment.value / total_requirement) * 100;

          // Calculate the progression for this segment
          let segmentProgression = Math.floor(
            Math.min((unUsedEntires / segment.value) * 100, 100)
          );
          if (segmentProgression < 0) segmentProgression = 0;

          const progressionBarTooltipContent = `
          <div class="flex flex-col gap-2 p-2 w-42">
            <h3 class="font-bold text-center">${segment.name}</h3>
            <span>Suoritettu: ${segmentProgression}%</span>
            <span class="">
              Merkinnät: ${Math.min(Math.max(unUsedEntires, 0), segment.value)} / ${segment.value}
            </span>
          </div>
        `;

          // Reduce the total_entry_count by the segment's value
          unUsedEntires -= segment.value;

          return (
            <div
              key={index}
              className={cc(
                "bottom-0 h-1 clickableCourseSegment rounded-xl hover:cursor-pointer"
              )}
              data-tooltip-html={progressionBarTooltipContent}
              style={{ width: `${segmentLength}%` }}
            >
              <div
                className={cc("h-full bg-primaryColor relative rounded-xl")}
                style={{
                  backgroundColor: segmentProgression === 100 ? "#22c55e" : "",
                  width: `${segmentProgression}%`,
                }}
              ></div>
            </div>
          );
        })}
      </div>
    );
  };

  const renderSortingSelect = () => {
    return (
      <div className="right-0 flex flex-col mt-4 lg:absolute md:mt-0">
        <label htmlFor="sorting" className="px-2 text-xs text-textSecondary">
          Järjestys:
        </label>
        <select
          name="sorting"
          id="sortingSelect"
          value={state.selectedSorting}
          className="p-1 border m-auto rounded-md bg-bgSecondary border-borderPrimary text-textSecondary hover:cursor-pointer "
          onChange={(e) => {
            handleViewUpdate({ ...state, selectedSorting: e.target.value });
          }}
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

          <option value="progression1">Edistyminen laskeva</option>
          <option value="progression2">Edistyminen nouseva</option>
        </select>
      </div>
    );
  };

  const RenderWeeks = ({ journals }) => {
    if (journals?.length === 0) {
      return <div className="flex justify-center w-full">Ei hakutuloksia</div>;
    } else
      return (
        <div className="flex flex-col justify-center w-full">
          {/* Date controls */}
          <div className="relative flex flex-col w-full mb-4 text-center">
            <h2 className="text-textSecondary">
              {state.showDate.getFullYear()}
            </h2>{" "}
            <h2 className="text-textSecondary">
              {formatDate(startOfWeek(state.showDate, { weekStartsOn: 1 }), {
                day: "numeric",
              })}
              {". "}
              {formatDate(startOfWeek(state.showDate, { weekStartsOn: 1 }), {
                month: "long",
              })}{" "}
              <span> - </span>
              {formatDate(endOfWeek(state.showDate, { weekStartsOn: 1 }), {
                day: "numeric",
              })}
              {". "}
              {formatDate(endOfWeek(state.showDate, { weekStartsOn: 1 }), {
                month: "long",
              })}
            </h2>
            <div className="flex justify-center gap-4 hover:">
              <button
                className="hover:text-primaryColor"
                onClick={() => {
                  handleViewUpdate({
                    ...state,
                    showDate: subWeeks(state.showDate, 1),
                  });
                }}
              >
                <IconContext.Provider
                  value={{ className: "hover:text-primaryColor" }}
                >
                  <FiChevronLeft />
                </IconContext.Provider>
              </button>
              <span className="text-xl flex gap-2 items-center">
                <p className="">viikko</p>
                {getWeek(state.showDate)}
              </span>
              <button
                className="hover:text-primaryColor"
                onClick={() => {
                  handleViewUpdate({
                    ...state,
                    showDate: addWeeks(state.showDate, 1),
                  });
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
          <div className="grid grid-cols-1 gap-4 justify-items-center lg:grid-cols-2">
            {journals?.map((journal) => {
              return (
                <div
                  key={journal.user_id}
                  className="relative flex flex-col w-full max-w-lg p-2 overflow-hidden border rounded-md border-borderPrimary hover:bg-hoverDefault group/studentCard"
                  id="studentCard"
                >
                  {
                    <RenderFavouriteMark
                      journal={journal}
                      queryClient={queryClient}
                      pinnedStudentsData={pinnedStudentsData}
                    />
                  }
                  <div className="flex-col items-center justify-between gap-2">
                    <Link
                      to={`opiskelijat/${journal.user_id}`}
                      className="flex gap-1 hover:cursor-pointer hover:underline"
                    >
                      <p>{journal.first_name}</p>
                      <p>{journal.last_name}</p>
                    </Link>
                    <HeatMap_Weeks_Memoized
                      journal={journal}
                      showDate={state.showDate}
                    />
                  </div>
                  {/* Progress bar */}
                  {renderProgressionBar({ student: journal })}
                </div>
              );
            })}
          </div>
        </div>
      );
  };

  const RenderMonths = ({ journals }) => {
    if (journals.length === 0) {
      return <div className="flex justify-center w-full">Ei hakutuloksia</div>;
    } else
      return (
        <div className="flex flex-col justify-center w-full">
          <div className="relative flex flex-col mb-8 text-center">
            <h2 className="text-textSecondary">
              {state.showDate.getFullYear()}
            </h2>
            <div className="flex justify-center gap-4 hover:">
              <button
                className="hover:underline"
                onClick={() => {
                  handleViewUpdate({
                    ...state,
                    showDate: subMonths(state.showDate, 1),
                  });
                }}
              >
                <IconContext.Provider
                  value={{ className: "hover:text-primaryColor" }}
                >
                  <FiChevronLeft />
                </IconContext.Provider>
              </button>
              <p className="w-24 text-xl">
                {formatDate(state.showDate, { month: "long" })}
              </p>
              <button
                className="hover:fill-blue-500 hover:underline"
                onClick={() => {
                  handleViewUpdate({
                    ...state,
                    showDate: addMonths(state.showDate, 1),
                  });
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
          <div className="flex flex-wrap justify-center gap-4 lg:gap-8">
            {journals.map((journal) => {
              return (
                <div
                  key={journal.user_id}
                  className="relative flex flex-col w-64 gap-2 p-4 overflow-hidden border rounded-md border-borderPrimary hover:bg-hoverDefault group/studentCard"
                  id="studentCard"
                >
                  {
                    <RenderFavouriteMark
                      journal={journal}
                      queryClient={queryClient}
                      pinnedStudentsData={pinnedStudentsData}
                    />
                  }
                  <Link
                    to={`/opettaja/opiskelijat/${journal.user_id}`}
                    className="flex flex-col pt-2 "
                  >
                    <p className="text-lg text-center hover:cursor-pointer hover:underline">
                      {journal.first_name} {journal.last_name}
                    </p>
                  </Link>
                  <HeatMap_Month_Memoized
                    journal={journal}
                    showDate={state.showDate}
                  />
                  {renderProgressionBar({ student: journal })}
                </div>
              );
            })}
          </div>
        </div>
      );
  };

  // RenderYears component
  const RenderYears = ({ journals }) => {
    const handlePreviousYearClick = (e) => {
      e.preventDefault();
      const newDate = new Date(state.showDate);
      newDate.setFullYear(
        state.showDate.getFullYear() - 1,
        state.showDate.getMonth(),
        state.showDate.getDate()
      );
      handleViewUpdate({ ...state, showDate: newDate });
    };

    const handleNextYearClick = (e) => {
      e.preventDefault();
      const newDate = new Date(state.showDate);
      newDate.setFullYear(
        state.showDate.getFullYear() + 1,
        state.showDate.getMonth(),
        state.showDate.getDate()
      );

      handleViewUpdate({ ...state, showDate: newDate });
    };

    if (journals.length === 0) {
      return <div className="flex justify-center w-full">Ei hakutuloksia</div>;
    } else
      return (
        <div className="flex flex-col justify-center w-full">
          <div className="relative flex flex-col mb-8 text-center">
            <div className="flex justify-center gap-4 hover:">
              <button
                className="hover:text-primaryColor"
                onClick={handlePreviousYearClick}
              >
                <FiChevronLeft />
              </button>
              <p className="text-xl">{state.showDate.getFullYear()}</p>
              <button
                className="hover:text-primaryColor"
                onClick={handleNextYearClick}
              >
                <FiChevronRight />
              </button>
            </div>
            {renderSortingSelect()}
          </div>
          <div className="flex flex-col justify-center gap-4 overflow-x-hidden lg:gap-8">
            {journals.map((journal) => {
              return (
                <div
                  key={journal.user_id}
                  className="relative flex flex-col gap-2 p-4 overflow-hidden border rounded-md group/studentCard border-borderPrimary hover:bg-hoverDefault"
                  id="studentCard"
                >
                  {
                    <RenderFavouriteMark
                      journal={journal}
                      queryClient={queryClient}
                      pinnedStudentsData={pinnedStudentsData}
                    />
                  }
                  <div className="flex flex-wrap items-end gap-4 p-2 leading-none">
                    <Link
                      to={`/opettaja/opiskelijat/${journal.user_id}`}
                      className="text-lg leading-none text-center hover:cursor-pointer hover:underline"
                    >
                      {journal.first_name} {journal.last_name}
                    </Link>

                    <p className="text-textSecondary">
                      Toimipiste: {journal.campus_name}
                    </p>
                    <p className="text-textSecondary">ryhmä: {journal.name}</p>
                    <p className="flex text-textSecondary">
                      Laji: {journal.sport_name}
                    </p>
                  </div>
                  <HeatMap_Year_Memoized
                    journal={journal}
                    showDate={state.showDate}
                  />
                  {renderProgressionBar({ student: journal })}
                </div>
              );
            })}
          </div>
        </div>
      );
  };

  if (optionsDataLoading || StudentsListLoading || pinnedStudentsLoading) {
    return <LoadingScreen />;
  } else
    return (
      <div className="flex flex-col gap-8 lg:m-8 text-textPrimary">
        <TeacherHeatmapTooltip />

        {/* filtering controls */}
        <div className="flex flex-col items-center justify-around w-full gap-8 p-4 mx-auto border rounded-md bg-bgSecondary border-borderPrimary">
          {/* Aika filtteri */}
          <div className="relative flex justify-center w-full text-sm">
            <div className="relative flex justify-center text-sm text-textSecondary">
              <p
                onClick={() => handleViewChange("weeks")}
                className={`cursor-pointer mx-2 ${state.showWeeks && "text-primaryColor border-b border-primaryColor"}`}
              >
                Viikko
              </p>
              <p
                onClick={() => handleViewChange("months")}
                className={`cursor-pointer mx-2 ${state.showMonths && "text-primaryColor border-b border-primaryColor"}`}
              >
                Kuukausi
              </p>
              <p
                onClick={() => handleViewChange("years")}
                className={`cursor-pointer mx-2 ${state.showYears && "text-primaryColor border-b border-primaryColor"}`}
              >
                Vuosi
              </p>
            </div>
          </div>

          <div className="flex-wrap items-center justify-center hidden w-full gap-2 text-sm lg:flex lg:gap-8">
            <StudentMultiSelect
              studentArray={StudentsList}
              state={state}
              handleViewUpdate={(newState) => handleViewUpdate(newState)}
              filter={state.selectedStudents}
            />
            <SportsMultiSelect
              sportsArray={options.sports}
              state={state}
              handleViewUpdate={(newState) => handleViewUpdate(newState)}
              availableSports={availableOptions.sports}
            />
            <CampusMultiSelect
              campusArray={options.campuses}
              state={state}
              handleViewUpdate={(newState) => handleViewUpdate(newState)}
              availableCampuses={availableOptions.campuses}
            />
            <GroupMultiSelect
              groupArray={options.student_groups}
              state={state}
              handleViewUpdate={(newState) => handleViewUpdate(newState)}
              availableGroups={availableOptions.groups}
            />

            <div className="flex justify-center text-sm lg:gap-8">
              <button
                className="Button bg-btnGray hover:bg-hoverGray"
                onClick={handleFilterReset}
              >
                Nollaa
              </button>
            </div>
          </div>

          {/* filtres for mobile  */}
          <div className="flex flex-col w-full lg:hidden">
            <div
              className="flex items-center justify-center w-full gap-8 py-2 border-b cursor-pointer select-none text-textSecondary border-borderPrimary"
              onClick={() => {
                setState({
                  ...state,
                  showMobileFilters: !state.showMobileFilters,
                });
              }}
            >
              {state.showMobileFilters
                ? "Piilota suodattimet"
                : "Näytä suodattimet"}
              {state.showMobileFilters ? <FiChevronUp /> : <FiChevronDown />}
            </div>

            {state.showMobileFilters && (
              <div
                className={cc(
                  "grid lg:hidden w-full items-center gap-2 lg:gap-8"
                )}
              >
                <StudentMultiSelect
                  studentArray={StudentsList}
                  state={state}
                  handleViewUpdate={(newState) => handleViewUpdate(newState)}
                  filter={state.selectedStudents}
                />
                <SportsMultiSelect
                  sportsArray={options.sports}
                  state={state}
                  handleViewUpdate={(newState) => handleViewUpdate(newState)}
                  availableSports={availableOptions.sports}
                />
                <CampusMultiSelect
                  campusArray={options.campuses}
                  state={state}
                  handleViewUpdate={(newState) => handleViewUpdate(newState)}
                  availableCampuses={availableOptions.campuses}
                />
                <GroupMultiSelect
                  groupArray={options.student_groups}
                  state={state}
                  handleViewUpdate={(newState) => handleViewUpdate(newState)}
                  availableGroups={availableOptions.groups}
                />

                <div className="flex justify-center text-sm lg:gap-8">
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

        {state.viewDataHandled && courseSegments ? (
          <div className="w-full p-4 border rounded-md bg-bgSecondary border-borderPrimary">
            <div id="studentList" className="flex justify-center w-full gap-8">
              {state.showWeeks && (
                <RenderWeeks journals={state.viewableJournals} />
              )}
              {state.showMonths && (
                <RenderMonths journals={state.viewableJournals} />
              )}
              {state.showYears && (
                <RenderYears journals={state.viewableJournals} />
              )}
            </div>
            <div className="mx-auto my-8">{RenderPaginationNav()}</div>
          </div>
        ) : (
          <div className="w-full border rounded-md h-fit bg-bgSecondary border-borderPrimary">
            <LoadingScreen />
          </div>
        )}

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
        />
      </div>
    );
}
export default TeacherHome;

import { useState, useMemo } from "react";
import publicService from "../../services/publicService.js";
import { useMainContext } from "../../hooks/mainContext.jsx";
import { useQuery } from "@tanstack/react-query";

import HeatMap_Year from "../../components/Heatmaps/HeatMap_Year.jsx";
import HeatMap_Month from "../../components/Heatmaps/HeatMap_Month.jsx";
import HeatMap_Weeks from "../../components//Heatmaps/HeatMap_Weeks.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";

import StudentComboBox from "../../components/ComboBoxes/StudentsComboBox.jsx";
import SportComboBox from "../../components/ComboBoxes/SportsComboBox.jsx";
import StudentGroupComboBox from "../../components/ComboBoxes/GroupComboBox.jsx";
import CampusComboBox from "../../components/ComboBoxes/CampusComboBox.jsx";

import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { IconContext } from "react-icons/lib";
import { addMonths, addWeeks, getWeek, subMonths, subWeeks } from "date-fns";
import formatDate from "../../utils/formatDate.ts";
import { Link } from "react-router-dom";
import userService from "../../services/userService.js";
import { TeacherHeatmapTooltip } from "../../components/heatmap-tooltip/TeacherHeatmapTooltip.jsx";

function TeacherHome() {
  const [options, setOptions] = useState([]); // [campuses, sports, set

  const [showWeeks, setShowWeeks] = useState(true);
  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);

  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedSport, setSelectedSport] = useState("");
  const [selectedStudentGroup, setSelectedStudentGroup] = useState("");
  const [selectedCampus, setSelectedCampus] = useState("");
  const { setShowDate } = useMainContext();

  const {
    data: studentsAndJournalsData,
    isLoading: studentsAndJournalsDataLoading,
    error: studentsAndJournalsDataError,
  } = useQuery({
    queryKey: ["studentsAndJournals"],
    queryFn: () => userService.getStudentsAndEntries(),
    staleTime: 30 * 60 * 1000, //30 minutes
  });

  console.log("isLoading: ", studentsAndJournalsDataLoading)

  console.log(studentsAndJournalsData);

  const filteredJournals = useMemo(() => {
    if (!studentsAndJournalsData) return [];

    let filtJournals = [...studentsAndJournalsData];

    if (selectedCampus) {
      filtJournals = filtJournals.filter(
        (journal) => journal.campus === (selectedCampus.name || selectedCampus)
      );
    }
    if (selectedSport) {
      filtJournals = filtJournals.filter(
        (journal) => journal.sport === selectedSport.name
      );
    }
    if (selectedStudentGroup) {
      filtJournals = filtJournals.filter(
        (journal) => journal.group === selectedStudentGroup.group_identifier
      );
    }
    if (selectedStudent) {
      filtJournals = filtJournals.filter(
        (journal) => journal.user_id === selectedStudent.id
      );
    }
    return filtJournals;
  }, [
    studentsAndJournalsData,
    selectedCampus,
    selectedSport,
    selectedStudentGroup,
    selectedStudent,
  ]);


  const RenderWeeks = ({ journals }) => {
    const { showDate, setShowDate } = useMainContext();

    if (journals.length === 0) {
      return <div className="flex justify-center w-full">Ei hakutuloksia</div>;
    } else
      return (
        <div className="flex flex-col justify-center">
          {/* Date controls */}
          <div className="flex w-full flex-col text-center mb-4">
            <h2 className="text-textSecondary">{showDate.getFullYear()}</h2>
            <div className="hover: flex justify-center gap-4">
              <button
                className="hover:underline"
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
                className="hover:fill-blue-500 hover:underline"
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
            {journals.map((journal) => (
              // Student card
              <div
                key={journal.user_id}
                className="flex flex-col rounded-md j bg-bgSecondary p-3 border border-primaryColor shadow-sm hover:shadow-primaryColor w-full"
                id="studentCard"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link
                    to={`/opettaja/opiskelijat/${journal.user_id}`}
                    className="flex gap-1 hover:cursor-pointer hover:underline"
                  >
                    <p> {journal.first_name}</p>
                    <p>{journal.last_name}</p>
                  </Link>

                  {console.log(journal)}
                  <HeatMap_Weeks journal={journal} />
                </div>
              </div>
            ))}
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
            {journals.map((journal) => (
              <div
                key={journal.user_id}
                className="flex flex-col gap-2 w-64 rounded-md border border-primaryColor shadow-sm hover:shadow-primaryColor"
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

                <div className="bg-bgPrimary p-2 rounded-md">
                  <HeatMap_Month journal={journal} />
                </div>
              </div>
            ))}
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
        <div className="flex flex-col justify-center overflow-x-auto">
          <div className="flex flex-col text-center mb-8">
            <div className="hover: flex justify-center gap-4">
              <button
                className="hover:underline"
                onClick={handlePreviousYearClick}
              >
                <IconContext.Provider
                  value={{ className: "hover:text-primaryColor" }}
                >
                  <FiChevronLeft />
                </IconContext.Provider>
              </button>
              <p className="text-xl">{showDate.getFullYear()}</p>
              <button
                className="hover:fill-blue-500 hover:underline"
                onClick={handleNextYearClick}
              >
                <IconContext.Provider
                  value={{ className: "hover:text-primaryColor" }}
                >
                  <FiChevronRight />
                </IconContext.Provider>
              </button>
            </div>
          </div>
          <div className="flex flex-col lg:gap-8 gap-4 justify-center overflow-x-hidden">
            {journals.map((journal) => (
              <div
                key={journal.user_id}
                className="flex flex-col gap-2 rounded-md bg-bgSecondary border
               border-primaryColor shadow-sm hover:shadow-primaryColor"
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
                <div className="bg-bgPrimary p-2 rounded-md">
                  <HeatMap_Year journal={journal} />
                </div>
              </div>
            ))}
          </div>
        </div>
      );
  };

  const handleFilterReset = () => {
    setSelectedCampus("");
    setSelectedSport("");
    setSelectedStudentGroup("");
    setSelectedStudent("");
    setFilteredJournals(studentsAndJournalsData);
    setShowDate(new Date());
  };
  /*
  useEffect(() => {
    // Get journal entries for all students
    userService
      .getStudents()
      .then((response) => {
        setJournals(response);
        setFilteredJournals(response);
      })

      .catch((error) => {
        console.log(error);
      });

    // Get options for filters ( campuses, sports, students )
    publicService.getOptions().then((response) => {
      setOptions(response);
      console.log(response);
    });
  }, []);
*/

  if (studentsAndJournalsDataLoading) {
    return (
      <>
        <LoadingScreen />
      </>
    );
  } else
    return (
      <div className="flex flex-col gap-8 lg:m-8 text-textPrimary">
        <TeacherHeatmapTooltip />

        <div
          className="bg-bgSecondary flex flex-col w-fit mx-auto align-middle lg:justify-center
           rounded-md p-4 justify-between lg:p-8 lg:gap-8 shadow-md"
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
          <div className="flex gap-8">
            <StudentComboBox
              journals={studentsAndJournalsData}
              selectedStudent={selectedStudent}
              setSelectedStudent={setSelectedStudent}
            />
            <SportComboBox
              sports={options.sports}
              selectedSport={selectedSport}
              setSelectedSport={setSelectedSport}
            />
            <StudentGroupComboBox
              groups={options.student_groups}
              selectedStudentGroup={selectedStudentGroup}
              setSelectedStudentGroup={setSelectedStudentGroup}
            />
            <CampusComboBox
              campuses={options.campuses}
              selectedCampus={selectedCampus}
              setSelectedCampus={setSelectedCampus}
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
        </div>

        {/* student list */}
        {/* <div
          id="studentList"
          className="flex lg:ml-72 gap-8 rounded-md bg-bgSecondary p-4 "
        > */}
        <div
          id="studentList"
          className="flex w-full gap-8 rounded-md bg-bgSecondary p-4 justify-center"
        >

          {showWeeks && <RenderWeeks journals={filteredJournals} />}
        {showMonths && <RenderMonths journals={filteredJournals} />}
          {showYears && <RenderYears journals={filteredJournals} />}
        </div>
      </div>
    );
}
export default TeacherHome;

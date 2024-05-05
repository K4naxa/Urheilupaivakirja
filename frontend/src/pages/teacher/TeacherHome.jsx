import trainingService from "../../services/trainingService.js";

import HeatMap_Year_Teacher from "../../components/HeatMap_Year_Teacher.jsx";
import HeatMap_Month from "../../components/HeatMap_Month_Teacher.jsx";
import HeatMap_Weeks from "../../components/HeatMap_Weeks.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
import StudentComboBox from "../../components/ComboBoxes/StudentsComboBox.jsx";
import { useMainContext } from "../../hooks/mainContext.jsx";
import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { IconContext } from "react-icons/lib";

import { useEffect, useState } from "react";

const RenderWeeks = ({ journals }) => {
  const { showDate, setShowDate } = useMainContext();

  const getWeekNumber = (date) => {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
    const pastDaysOfYear = (date - firstDayOfYear) / 86400000; // 1 day in milliseconds
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
  };

  const handlePreviousWeekClick = (e) => {
    e.preventDefault();
    const newDate = new Date(showDate);
    newDate.setDate(showDate.getDate() - 7); // Subtract 7 days to go to the previous week
    setShowDate(newDate);
  };

  const handleNextWeekClick = (e) => {
    e.preventDefault();
    const newDate = new Date(showDate);
    newDate.setDate(showDate.getDate() + 7); // Add 7 days to go to the next week
    setShowDate(newDate);
  };
  return (
    <div>
      <div className="flex w-full flex-col text-center mb-8">
        <h2 className="text-textSecondary">{showDate.getFullYear()}</h2>
        <div className="hover: flex justify-center gap-4">
          <button className="hover:underline" onClick={handlePreviousWeekClick}>
            <IconContext.Provider
              value={{ className: "hover:text-graphPrimary" }}
            >
              <FiChevronLeft />
            </IconContext.Provider>
          </button>
          <p className="text-xl">{getWeekNumber(showDate) - 1}</p>
          <button
            className="hover:fill-blue-500 hover:underline"
            onClick={handleNextWeekClick}
          >
            <IconContext.Provider
              value={{ className: "hover:text-graphPrimary" }}
            >
              <FiChevronRight />
            </IconContext.Provider>
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {journals.map((journal) => (
          <div
            key={journal.user_id}
            className="rounded-md bg-bgkSecondary p-4 border border-headerPrimary shadow-md hover:shadow-headerPrimary"
            id="studentCard"
          >
            <div className="flex flex-wrap lg:gap-6 text-textSecondary text-xs">
              <p className=" hidden lg:flex">Toimipaikka: {journal.campus}</p>
            </div>

            <div className="flex">
              {journal.first_name} {journal.last_name}
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
  const handlePreviousMonthClick = (e) => {
    e.preventDefault();
    const newDate = new Date(showDate.getFullYear(), showDate.getMonth() - 1);
    setShowDate(newDate);
  };

  const handleNextMonthClick = (e) => {
    e.preventDefault();
    const newDate = new Date(showDate.getFullYear(), showDate.getMonth() + 1);
    setShowDate(newDate);
  };

  const monthNames = [
    "Tammikuu",
    "Helmikuu",
    "Maaliskuu",
    "Huhtikuu",
    "Toukokuu",
    "Kesäkuu",
    "Heinäkuu",
    "Elokuu",
    "Syyskuu",
    "Lokakuu",
    "Marraskuu",
    "Joulukuu",
  ];

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col text-center mb-8">
        <h2 className="text-textSecondary">{showDate.getFullYear()}</h2>
        <div className="hover: flex justify-center gap-4">
          <button
            className="hover:underline"
            onClick={handlePreviousMonthClick}
          >
            <IconContext.Provider
              value={{ className: "hover:text-graphPrimary" }}
            >
              <FiChevronLeft />
            </IconContext.Provider>
          </button>
          <p className="text-xl">{monthNames[showDate.getMonth()]}</p>
          <button
            className="hover:fill-blue-500 hover:underline"
            onClick={handleNextMonthClick}
          >
            <IconContext.Provider
              value={{ className: "hover:text-graphPrimary" }}
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
            className="flex flex-col gap-2 w-60 rounded-md bg-bgkSecondary p-4 border border-headerPrimary shadow-md hover:shadow-headerPrimary"
            id="studentCard"
          >
            <div className="flex flex-col">
              <p className="text-lg text-center">
                {journal.first_name} {journal.last_name}
              </p>
            </div>
            <div className="flex flex-col text-textSecondary text-sm">
              <p className="align-bottom hidden lg:flex">
                Toimipiste: {journal.campus}
              </p>
              <p>ryhmä: {journal.group}</p>
              <p>Laji: {journal.sport}</p>
            </div>
            <HeatMap_Month journal={journal} />
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
    newDate.setFullYear(showDate.getFullYear() - 1);
    setShowDate(newDate);
  };

  const handleNextYearClick = (e) => {
    e.preventDefault();
    const newDate = new Date(showDate);
    newDate.setFullYear(showDate.getFullYear() + 1);
    setShowDate(newDate);
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex flex-col text-center mb-8">
        <div className="hover: flex justify-center gap-4">
          <button className="hover:underline" onClick={handlePreviousYearClick}>
            <IconContext.Provider
              value={{ className: "hover:text-graphPrimary" }}
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
              value={{ className: "hover:text-graphPrimary" }}
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
            className="flex flex-col gap-2 rounded-md bg-bgkSecondary p-4 border
             border-headerPrimary shadow-md hover:shadow-headerPrimary"
            id="studentCard"
          >
            <div className="flex gap-4  leading-none items-end">
              <p className="text-lg text-center leading-none">
                {journal.first_name} {journal.last_name}
              </p>

              <p className="text-textSecondary">Toimipiste: {journal.campus}</p>
              <p className="text-textSecondary">ryhmä: {journal.group}</p>
              <p className="flex text-textSecondary">Laji: {journal.sport}</p>
            </div>
            <HeatMap_Year_Teacher journal={journal} />
          </div>
        ))}
      </div>
    </div>
  );
};

function TeacherHome() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showWeeks, setShowWeeks] = useState(true);
  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");

  useEffect(() => {
    trainingService
      .getJournalEntries()
      .then((response) => {
        setJournals(response);
        console.log(response);
      })

      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (journals.length > 0) {
      setLoading(false);
    }
  }, [journals]);

  if (loading) {
    return (
      <>
        <LoadingScreen />
      </>
    );
  } else
    return (
      <div className="flex gap-8 flex-col lg:m-8 lg:flex-row text-textPrimary">
        {/* filters */}
        <div
          className="bg-bgkSecondary flex flex-wrap align-middle lg:justify-center rounded-md
         h-fit w-full p-4 justify-between lg:p-8 lg:gap-8 lg:fixed lg:flex-col lg:w-64 lg:top-1/2 lg:transform lg:-translate-y-1/2 shadow-md"
        >
          <div className="flex text-textSecondary text-sm">
            <p
              onClick={() => {
                setShowWeeks(true);
                setShowMonths(false);
                setShowYears(false);
              }}
              className={`cursor-pointer mx-2 ${showWeeks && "text-headerPrimary border-b border-headerPrimary"}`}
            >
              Viikko
            </p>
            <p
              onClick={() => {
                setShowWeeks(false);
                setShowMonths(true);
                setShowYears(false);
              }}
              className={`cursor-pointer mx-2 ${showMonths && "text-headerPrimary border-b border-headerPrimary"}`}
            >
              Kuukausi
            </p>
            <p
              onClick={() => {
                setShowWeeks(false);
                setShowMonths(false);
                setShowYears(true);
              }}
              className={`cursor-pointer mx-2 ${showYears && "text-headerPrimary border-b border-headerPrimary"}`}
            >
              Vuosi
            </p>
          </div>
          <StudentComboBox
            journals={journals}
            selectedStudent={selectedStudent}
            setSelectedStudent={setSelectedStudent}
          />
          <div className="w-2/5 lg:w-full">
            <input
              type="text"
              name="groupFilter"
              id="groupFilter"
              className="text-lg  text-textPrimary border-borderPrimary bg-bgkSecondary h-10 w-full focus-visible:outline-none focus-visible:border-headerPrimary border-b p-1"
              placeholder="Hae Ryhmä"
            />
          </div>
          <div className="w-2/5 lg:w-full">
            <select
              name="sportFilter"
              id="sportFilter"
              className="text-lg  text-textPrimary border-borderPrimary bg-bgkSecondary h-10 w-full focus-visible:outline-none focus-visible:border-headerPrimary border-b p-1"
              placeholder="Hae Laji"
            >
              <option value="">Valitse ryhmä</option>
            </select>
          </div>
          <div className="w-2/5 lg:w-full">
            <input
              type="text"
              name="campusFilter"
              id="campusFilter"
              className="text-lg  text-textPrimary border-borderPrimary bg-bgkSecondary h-10 w-full focus-visible:outline-none focus-visible:border-headerPrimary border-b p-1"
              placeholder="Hae Kampus"
            />
          </div>
          <div className="flex lg:gap-8 justify-center text-sm">
            <button className="Button">Hae</button>{" "}
            <button className="Button bg-btnGray">Nollaa</button>
          </div>
        </div>

        {/* student list */}
        <div
          id="studentList"
          className="flex lg:ml-72 flex-col gap-8 rounded-md bg-bgkSecondary p-4 "
        >
          {showWeeks && <RenderWeeks journals={journals} />}
          {showMonths && <RenderMonths journals={journals} />}
          {showYears && <RenderYears journals={journals} />}
        </div>
      </div>
    );
}
export default TeacherHome;

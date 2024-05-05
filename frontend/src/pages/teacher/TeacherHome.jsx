import trainingService from "../../services/trainingService.js";
import dayjs from "dayjs";
import HeatMap_Year from "../../components/HeatMap_Year.jsx";
import HeatMap_Month from "../../components/HeatMap_Month_Teacher.jsx";
import HeatMap_Weeks from "../../components/HeatMap_Weeks.jsx";
import LoadingScreen from "../../components/LoadingScreen.jsx";
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
          <p className="text-xl">{getWeekNumber(showDate)}</p>
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
            <div className="flex gap-8">
              <p className="text-lg">
                {journal.first_name} {journal.last_name}
              </p>
              <div className="flex flex-wrap lg:gap-6 text-textSecondary text-sm">
                <p className=" hidden lg:flex">Toimipiste: {journal.campus}</p>
                <p>ryhmä: {journal.group}</p>
                <p>Laji: {journal.sport}</p>
              </div>
            </div>
            <HeatMap_Weeks journal={journal} />
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

function TeacherHome() {
  const [journals, setJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showWeeks, setShowWeeks] = useState(true);
  const [showMonths, setShowMonths] = useState(false);
  const [showYears, setShowYears] = useState(false);

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
          <div className="w-2/5 lg:w-full">
            <input
              type="text"
              name="nameFilter"
              id="nameFilter"
              className="w-full"
              placeholder="Hae Opiskelija"
            />
          </div>
          <div className="w-2/5 lg:w-full">
            <input
              type="text"
              name="groupFilter"
              id="groupFilter"
              className="w-full"
              placeholder="Hae Ryhmä"
            />
          </div>
          <div className="w-2/5 lg:w-full">
            <input
              type="text"
              name="sportFilter"
              id="sportFilter"
              className="w-full"
              placeholder="Hae Laji"
            />
          </div>
          <div className="w-2/5 lg:w-full">
            <input
              type="text"
              name="campusFilter"
              id="campusFilter"
              className="w-full"
              placeholder="Hae Kampus"
            />
          </div>
          <div className="flex lg:gap-8 justify-center text-sm">
            <button className="Button">Filtteröi</button>{" "}
            <button className="Button bg-btnGray">Nollaa</button>
          </div>
        </div>

        {/* student list */}
        <div
          id="studentList"
          className="flex lg:ml-72 flex-col gap-8 rounded-md bg-bgkSecondary p-4 "
        >
          {/* Which time to render  */}
          <div className="flex gap-2 ">
            <p
              onClick={() => {
                setShowWeeks(true);
                setShowMonths(false);
                setShowYears(false);
              }}
              className="cursor-pointer"
            >
              Viikko
            </p>
            <p
              onClick={() => {
                setShowWeeks(false);
                setShowMonths(true);
                setShowYears(false);
              }}
              className="cursor-pointer"
            >
              Kuukausi
            </p>
            <p
              onClick={() => {
                setShowWeeks(false);
                setShowMonths(false);
                setShowYears(true);
              }}
              className="cursor-pointer"
            >
              Vuosi
            </p>
          </div>

          {showWeeks && <RenderWeeks journals={journals} />}
          {showMonths && <RenderMonths journals={journals} />}
        </div>
      </div>
    );
}
export default TeacherHome;

import { useQuery } from "@tanstack/react-query";
import PractiseBoxes from "../../components/PractiseBoxes";
import HeatMap_Month from "../../components/Heatmaps/HeatMap_Month";
import HeatMap_Year from "../../components/Heatmaps/HeatMap_Year";
import RecentJournalEntries from "../../components/RecentJournalEntries";
import WorkoutIntensityChart from "../../components/WorkoutIntensityChart";
import WorkoutActivityChart from "../../components/WorkoutActivityChart";
import trainingService from "../../services/trainingService";
import LoadingScreen from "../../components/LoadingScreen";
import { useEffect, useState } from "react";

import { useMainContext } from "../../hooks/mainContext";
import formatDate from "../../utils/formatDate";

import { FiChevronLeft } from "react-icons/fi";
import { FiChevronRight } from "react-icons/fi";
import { IconContext } from "react-icons/lib";
import { addMonths, subMonths } from "date-fns";
import { useParams } from "react-router-dom";

function StudentPage() {
  const { id } = useParams();
  const [studentJournalData, setStudentJournalData] = useState([]);
  const [student, setStudent] = useState([]);

  const { showDate, setShowDate } = useMainContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const newData = await trainingService.getUserJournalEntriesByUserId(id);
        setStudentJournalData(newData.journal_entries);
        setStudent(newData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);

  if (studentJournalData)
    return (
      <div className="mainArea overflow-x-auto">
        <div className="text-xl my-2 p-2 ">
          {student.first_name} {student.last_name}
        </div>
        <div
          className={`bg-bgkPrimary text-textPrimary lg::grid-rows-2 grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-12`}
        >
          <div className=" flex flex-col justify-between gap-4 align-middle">
            <div className="grid place-items-center  gap-2">
              <div className="flex w-full flex-col justify-center text-center">
                {/* controls */}
                <h2 className="text-textSecondary">{showDate.getFullYear()}</h2>
                <div className="hover: flex justify-center gap-4">
                  <button
                    className="hover:underline"
                    onClick={() => {
                      setShowDate(subMonths(showDate, 1));
                    }}
                  >
                    <IconContext.Provider
                      value={{ className: "hover:text-graphPrimary" }}
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
                      value={{ className: "hover:text-graphPrimary" }}
                    >
                      <FiChevronRight />
                    </IconContext.Provider>
                  </button>
                </div>
              </div>
              <div className="bg-bgSecondary flex w-full p-4 rounded-md">
                {" "}
                <HeatMap_Month journal={studentJournalData} />
              </div>
            </div>

            <PractiseBoxes journalEntries={studentJournalData} />
          </div>
          <div className=" flex flex-col gap-4">
            <WorkoutActivityChart journal={studentJournalData} />
            <WorkoutIntensityChart journal={studentJournalData} />
          </div>
          <div className="sm:col-span-2 lg:col-span-1">
            <RecentJournalEntries journal={studentJournalData} />
          </div>
          <div className="flex  overflow-x-auto self-center sm:col-span-2 lg:col-span-3 bg-bgSecondary p-4 rounded-md">
            <HeatMap_Year journal={studentJournalData} />
          </div>
        </div>
      </div>
    );
}

export default StudentPage;

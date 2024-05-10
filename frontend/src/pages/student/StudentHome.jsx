import { useQuery } from "@tanstack/react-query";
import PractiseBoxes from "../../components/PractiseBoxes";
import HeatMap_Month from "../../components/cal-HeatMap_Month";
import HeatMap_Year from "../../components/HeatMap_Year";
import RecentJournalEntries from "../../components/RecentJournalEntries";
import WorkoutIntensityChart from "../../components/WorkoutIntensityChart";
import WorkoutActivityChart from "../../components/WorkoutActivityChart";
import trainingService from "../../services/trainingService";
import LoadingScreen from "../../components/LoadingScreen";
import { useEffect } from "react";

function StudentHome() {
  const {
    data: studentJournalData,
    isLoading: studentJournalDataLoading,
    error: studentJournalDataError,
    isSuccess,
  } = useQuery({
    queryKey: ["studentJournal"],
    queryFn: () => trainingService.getAllUserJournalEntries(),
    staleTime: 15 * 60 * 1000, // = 15 minutes in milliseconds - how long to use the cached data before re-fetching
  });

  useEffect(() => {
    console.log("StudentJournalData fetched successfully");
  }, [isSuccess]);

  if (studentJournalDataLoading) {
    return (
      <div className="flex justify-center items-center">
        <LoadingScreen />
      </div>
    );
  }

  if (studentJournalDataError) {
    return (
      <div className="flex justify-center items-center">
        <h1>Jokin meni vikaan</h1>
      </div>
    );
  }
  console.log("studentJournal", studentJournalData);
  return (
    <div className="mainArea overflow-x-auto">
      <div
        className={`bg-bgkPrimary text-textPrimary lg::grid-rows-2 grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-12`}
      >
        <div className=" flex flex-col justify-between gap-4 align-middle md:gap-12">
          <HeatMap_Month journal={studentJournalData} />
          <PractiseBoxes journalEntries={studentJournalData} />
        </div>
        <div className=" flex flex-col gap-4">
          <WorkoutActivityChart journal={studentJournalData} />
          <WorkoutIntensityChart journal={studentJournalData} />
        </div>
        <div className="sm:col-span-2 lg:col-span-1">
          <RecentJournalEntries journal={studentJournalData} />
        </div>
        <div className="flex  overflow-x-auto self-center sm:col-span-2 lg:col-span-3">
          <HeatMap_Year journal={studentJournalData} />
        </div>
      </div>
    </div>
  );
}

export default StudentHome;

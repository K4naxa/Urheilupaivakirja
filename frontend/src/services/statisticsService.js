import apiClient from "./apiClient";

const getAllJournalEntryDataBetweenDates = async (date1, date2) => {
    try {
      const response = await apiClient.get("/statistics/entries", {
        params: { date1, date2 }
      });
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching journal entries:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };
  
  const getNewStudentsBetweenDates = async (date1, date2) => {
    try {
      const response = await apiClient.get(
        "/statistics/new-students",
        {
          params: { date1, date2 }
        }
      );
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching new student count:",
        error.response ? error.response.data : error.message
      );
      throw error;
    }
  };

  export default {
    getAllJournalEntryDataBetweenDates,
    getNewStudentsBetweenDates,
  };
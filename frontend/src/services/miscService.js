import apiClient from "./apiClient";

// get all unverified students
const getUnverifiedStudentsSportsCampuses = async () => {
  const response = await apiClient.get("/unverified/");
  return response.data;
};

const getGroupsSportsCampusesOptions = async () => {
  const response = await apiClient.get("/register/options");
  return response.data;
};

export default {
  getGroupsSportsCampusesOptions,
  getUnverifiedStudentsSportsCampuses,
};

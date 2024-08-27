import apiClient from "./apiClient";

// Get all students and their journal entries for a given year
const getPaginatedStudentsData = async (students, showDate) => {
  const response = await apiClient.post(
    `/student/paginated/`,
    { students, showDate }
  );
  return response.data;
};

// Student Management -------------------------------------------------------------------
const getStudents = async () => {
  const response = await apiClient.get("/student");
  return response.data;
};

const getStudentData = async () => {
  const response = await apiClient.get(`/student/data/`);
  return response.data;
};

const getStudentDataWithId = async (userId) => {
  const response = await apiClient.get(`/student/data/${userId}`);
  return response.data;
};

const getArchivedStudents = async () => {
  const response = await apiClient.get("/student/archived");
  return response.data;
};

const toggleStudentArchive = async (id) => {
  const response = await apiClient.put(
    `/student/archive/${id}`,
    {}
  );
  return response.data;
};

// Pinned / pinning students ---------------------------------------------------------

const getPinnedStudents = async () => {
  const response = await apiClient.get("/student/pinned");
  return response.data;
};

const pinStudent = async (id) => {
  const response = await apiClient.put(`/student/pin/${id}`, {});
  return response.data;
};

const unpinStudent = async (id) => {
  const response = await apiClient.put(
    `/student/unpin/${id}`,
    {}
  );
  return response.data;
};

// Unverified / student verification management ---------------------------------------------------------------

const verifyStudent = async (userid) => {
  const response = await apiClient.put(
    `/student/verify/${userid}`,
    {}
  );
  return response.data;
};

// Delete a student by id
const deleteStudent = async (userId) => {
  const response = await apiClient.delete(`/user/${userId}`);
  return response.data;
};

export default {
  getStudents,
  getStudentData,
  getStudentDataWithId,
  getArchivedStudents,
  toggleStudentArchive,
  getPinnedStudents,
  pinStudent,
  unpinStudent,
  verifyStudent,
  deleteStudent,
  getPaginatedStudentsData,
};

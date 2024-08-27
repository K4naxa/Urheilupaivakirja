/*

const getToken = () => {
  const userJson = localStorage.getItem("user");
  if (userJson) {
    const user = JSON.parse(userJson);
    return user.token;
  }
  return null;
};

// make authorization header
const makeHeader = () => {
  let header = { headers: { Authorization: `bearer ${getToken()}` } };
  return header;
};

// ................................................................................
/*
const login = async (email, password) => {
  const response = await apiClient.post("/auth/login", {
    email: email,
    password: password,
  });
  return response.data;
};
*/
/*
// Register -------------------------------------------------------------------
const register = async (
  email,
  password,
  firstName,
  lastName,
  sportId,
  groupId,
  campusId
) => {
  const response = await apiClient.post("user/register", {
    email: email,
    password: password,
    first_name: firstName,
    last_name: lastName,
    sport_id: sportId,
    group_id: groupId,
    campus_id: campusId,
  });
  return response.data;
};

const createEmailVerificationOTP = async () => {
  const response = await apiClient.post(
    "/register/new-email-verification",
    null
  );
  return response.data;
};

const sendEmailVerificationOTP = async (otp) => {
  const response = await apiClient.post(
    "/register/verify-email",
    { otp }
  );
  return response.data;
};
*/
// Password Reset -------------------------------------------------------------------
/*
const requestPasswordReset = async (email) => {
  const response = await apiClient.post("/user/request-password-reset", { email });
  return response.data;
};

const verifyPasswordResetOTP = async (email, otp) => {
  const response = await apiClient.post("/user/verify-password-reset", {
    email,
    otp,
  });
  return response.data;
};

const resetPassword = async (email, resetToken, newPassword) => {
  const response = await apiClient.post("/user/reset-password", {
    email,
    resetToken,
    newPassword,
  });
  return response.data;
};

const verifyPassword = async (password) => {
  const response = await apiClient.post(
    "/user/verify-password",
    { password }
  );
  if (response.status === 200) {
    return true;
  }
};
*/

// User Controls -------------------------------------------------------------------
/*
const deleteUserSelf = async (password) => {
  const response = await apiClient.post("/user/self", { password });
  return response.data;
};

// Profile Data -------------------------------------------------------------------
const getProfileData = async () => {
  const response = await apiClient.get(`/user/profile`);
  return response.data;
};

const deleteUser = async (userId) => {
  const response = await apiClient.delete(`/user/${userId}`);
  return response.data;
};

const deleteTeacher = async (userId) => {
  const response = await apiClient.delete(`/user/teacher/${userId}`);
  return response.data;
};

*/
// Unverified Management -------------------------------------------------------------------





// Student Management -------------------------------------------------------------------
/*
const getStudents = async () => {
  const response = await apiClient.get("/students");
  return response.data;
};

const getStudentData = async () => {
  const response = await apiClient.get(`/students/data/`);
  return response.data;
};

const getStudentData = async (userId) => {
  const response = await apiClient.get(`/students/data/${userId}`);
  return response.data;
};

const getArchivedStudents = async () => {
  const response = await apiClient.get("/students/archived");
  return response.data;
};

const toggleStudentArchive = async (id) => {
  const response = await apiClient.put(`/students/archive/${id}`, {});
  return response.data;
};

// Pinning Students Logic ---------------------------------------------------------

const getPinnedStudents = async () => {
  const response = await apiClient.get("/students/pinned");
  return response.data;
};

const pinStudent = async (id) => {
  const response = await apiClient.put(`/students/pin/${id}`, {});
  return response.data;
};

const unpinStudent = async (id) => {
  const response = await apiClient.put(`/students/unpin/${id}`, {});
  return response.data;
};

*/
// Statistics -------------------------------------------------------------------
/*
const getAllJournalEntryDataBetweenDates = async (date1, date2) => {
  try {
    const response = await apiClient.get("/students/entries/statistics", {
      params: { date1, date2 },
      ...makeHeader(),
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
      "/students/entries/statistics/new-students",
      {
        params: { date1, date2 },
        ...makeHeader(),
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
*/
/*
// Spectator  Management -------------------------------------------------------------------
const getSpectators = async () => {
  const response = await apiClient.get("/spectator");
  return response.data;
};

const getInvitedSpectators = async () => {
  const response = await apiClient.get("/spectator/invited");
  return response.data;
};

const registerSpectator = async (data) => {
  const response = await apiClient.post("/spectator/register", {
    token: data.token,
    email: data.email,
    password: data.password,
    first_name: data.firstName,
    last_name: data.lastName,
  });
  return response.data;
};

const inviteSpectator = async (email) => {
  const response = await apiClient.post(
    "/spectator/invite",
    { email }
  );
  return response.data;
};

const deactivateSpectator = async (id) => {
  const response = await apiClient.put(
    `/spectator/deactivate/${id}`,
    {}
  );
  return response.data;
};

*/
/*
// pagination teacher front page -------------------------------------------------------------------
const getPaginatedStudentsData = async (students, showDate) => {
  const response = await apiClient.post(
    `/students/paginated/`,
    { students, showDate }
  );
  return response.data;
};

export default {
  login,
  register,
  getAllUnverified,
  verifyStudent,
  deleteUser,
  getStudents,
  toggleStudentArchive,
  getArchivedStudents,
  createEmailVerificationOTP,
  sendEmailVerificationOTP,
  requestPasswordReset,
  verifyPasswordResetOTP,
  resetPassword,
  getStudentData,
  getStudentData,
  getAllJournalEntryDataBetweenDates,
  getNewStudentsBetweenDates,
  getPinnedStudents,
  pinStudent,
  unpinStudent,
  getSpectators,
  getInvitedSpectators,
  registerSpectator,
  inviteSpectator,
  deactivateSpectator,
  getProfileData,
  verifySport,
  verifyStudentGroup,
  deleteUserSelf,
  deleteTeacher,
  verifyPassword,
  getPaginatedStudentsData,
};
// Path: frontEnd/src/services/userService.js

*/
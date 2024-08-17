import axios from "axios";

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

const login = async (email, password) => {
  const response = await axios.post("/user/login", {
    email: email,
    password: password,
  });
  return response.data;
};

const register = async (
  email,
  password,
  firstName,
  lastName,
  sportId,
  groupId,
  campusId
) => {
  const response = await axios.post("user/register", {
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
  const response = await axios.post(
    "/user/new-email-verification",
    null,
    makeHeader()
  );
  return response.data;
};

const sendEmailVerificationOTP = async (otp) => {
  const response = await axios.post(
    "/user/verify-email",
    { otp },
    makeHeader()
  );
  return response.data;
};

const requestPasswordReset = async (email) => {
  const response = await axios.post("/user/request-password-reset", { email });
  return response.data;
};

const verifyPasswordResetOTP = async (email, otp) => {
  const response = await axios.post("/user/verify-password-reset", {
    email,
    otp,
  });
  return response.data;
};

const resetPassword = async (email, resetToken, newPassword) => {
  const response = await axios.post("/user/reset-password", {
    email,
    resetToken,
    newPassword,
  });
  return response.data;
};

// User Controls -------------------------------------------------------------------

const deleteUser = async (id) => {
  const response = await axios.delete(`/user/${id}`, makeHeader());
  return response.data;
};

// Unverified Management -------------------------------------------------------------------

const getAllUnverified = async () => {
  const response = await axios.get("/user/unverified/", makeHeader());
  return response.data;
};

const verifyStudent = async (userid) => {
  const response = await axios.put(`/user/verify/${userid}`, {}, makeHeader());
  return response.data;
};

const verifySport = async (sportId) => {
  const response = await axios.put(`/activate/sport/${sportId}`, {}, makeHeader());
  return response.data;
};


const verifyStudentGroup = async (studentGroupId) => {
  const response = await axios.put(`/activate/student_group/${studentGroupId}`, {}, makeHeader());
  return response.data;
}


// Student Management -------------------------------------------------------------------

const getStudents = async () => {
  const response = await axios.get("/students", makeHeader());
  return response.data;
};

const getStudentData = async (userId) => {
  const response = await axios.get(`/students/data/${userId}`, makeHeader());
  return response.data;
};
const getStudentsAndEntries = async () => {
  const response = await axios.get("/students/entries", makeHeader());
  return response.data;
};

const getArchivedStudents = async () => {
  const response = await axios.get("/students/archived", makeHeader());
  return response.data;
};

const toggleStudentArchive = async (id) => {
  const response = await axios.put(`/students/archive/${id}`, {}, makeHeader());
  return response.data;
};

// Pinning Students Logic ---------------------------------------------------------

const getPinnedStudents = async () => {
  const response = await axios.get("/students/pinned", makeHeader());
  return response.data;
};

const pinStudent = async (id) => {
  const response = await axios.put(`/students/pin/${id}`, {}, makeHeader());
  return response.data;
};

const unpinStudent = async (id) => {
  const response = await axios.put(`/students/unpin/${id}`, {}, makeHeader());
  return response.data;
};
// Statistics -------------------------------------------------------------------

const getAllJournalEntryDataBetweenDates = async (date1, date2) => {
  try {
    const response = await axios.get("/students/entries/statistics", {
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
    const response = await axios.get(
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

// Spectator  Management -------------------------------------------------------------------
const getSpectators = async () => {
  const response = await axios.get("/spectator", makeHeader());
  return response.data;
};

const getInvitedSpectators = async () => {
  const response = await axios.get("/spectator/invited", makeHeader());
  return response.data;
}

const registerSpectator = async (data) => {
  const response = await axios.post("/spectator/register", {
    token: data.token,
    email: data.email,
    password: data.password,
    first_name: data.firstName,
    last_name: data.lastName,
  });
  return response.data;
};

const inviteSpectator = async (email) => {
  const response = await axios.post("/spectator/invite", { email }, makeHeader());
  return response.data;
}


const deactivateSpectator = async (id) => {
  const response = await axios.put(`/spectator/deactivate/${id}`, {}, makeHeader()); 
  return response.data;
}



// Profile Data -------------------------------------------------------------------
const getProfileData = async () => {
  const response = await axios.get(`/user/profiledata`, makeHeader());
  return response.data;
};



// Spectator Management -------------------------------------------------------------------

export default {
  login,
  register,
  getAllUnverified,
  verifyStudent,
  deleteUser,
  getStudents,
  getStudentsAndEntries,
  toggleStudentArchive,
  getArchivedStudents,
  createEmailVerificationOTP,
  sendEmailVerificationOTP,
  requestPasswordReset,
  verifyPasswordResetOTP,
  resetPassword,
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
  verifyStudentGroup
};
// Path: frontEnd/src/services/userService.js

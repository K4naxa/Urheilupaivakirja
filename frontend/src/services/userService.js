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
  phone,
  sportId,
  groupId,
  campusId
) => {
  const response = await axios.post("user/register", {
    email: email,
    password: password,
    first_name: firstName,
    last_name: lastName,
    phone: phone,
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

// Unverified users -------------------------------------------------------------------

const getAllUnverified = async () => {
  const response = await axios.get("/user/unverified", makeHeader());
  return response.data;
};

const verifyUser = async (userid) => {
  const response = await axios.put(`/user/verify/${userid}`, {}, makeHeader());
  return response.data;
};

// Stundent Management -------------------------------------------------------------------

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

export default {
  login,
  register,
  getAllUnverified,
  verifyUser,
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
};
// Path: frontEnd/src/services/userService.js

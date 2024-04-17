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
  await axios.post("user/register", {
    email: email,
    password: password,
    first_name: firstName,
    last_name: lastName,
    phone: phone,
    sport_id: sportId,
    group_id: groupId,
    campus_id: campusId,
  });
};

const logout = () => {
  window.localStorage.removeItem("urheilupaivakirjaToken");
  window.sessionStorage.removeItem("urheilupaivakirjaToken");
  window.location.href = "/";
};

// User Controls -------------------------------------------------------------------

const deleteUser = async (id) => {
  const response = await axios.delete(`/user/${id}`, makeHeader());
  return response.data;
};

// Unverified users -------------------------------------------------------------------

const getUnverifiedUsers = async () => {
  const response = await axios.get("/user/unverified", makeHeader());
  return response.data;
};

const verifyUser = async (user) => {
  const response = await axios.put(`/user/verify/${user.id}`, {}, makeHeader());
  return response.data;
};

// Stundent Management -------------------------------------------------------------------

const getStudents = async () => {
  const response = await axios.get("/students", makeHeader());
  return response.data;
};

const getArchivedStudents = async () => {
  const response = await axios.get("/students/archived", makeHeader());
  return response.data;
};

const archiveStudent = async (id) => {
  const response = await axios.put(`/students/archive/${id}`, {}, makeHeader());
  return response.data;
};

export default {
  login,
  register,
  logout,
  getUnverifiedUsers,
  verifyUser,
  deleteUser,
  getStudents,
  archiveStudent,
  getArchivedStudents,
};
// Path: frontEnd/src/services/userService.js

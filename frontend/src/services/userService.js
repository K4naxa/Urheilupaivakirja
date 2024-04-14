import axios from "axios";

let token = null;
let tokenPromise = null;

const waitToken = async () => {
  await tokenPromise;
};

// set token function to get token from mainContext
const setToken = (newToken) => {
  token = newToken;
  console.log("token set to: ", token);
  tokenPromise = Promise.resolve();
};

// make authorization header
const makeHeader = () => {
  let header = { headers: { Authorization: `bearer ${token}` } };
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
  await waitToken();
  const response = await axios.delete(`/user/${id}`, makeHeader());
  return response.data;
};

// Unverified users -------------------------------------------------------------------

const getUnverifiedUsers = async () => {
  await waitToken();
  const response = await axios.get("/user/unverified", makeHeader());
  return response.data;
};

const verifyUser = async (user) => {
  await waitToken();
  const response = await axios.put(`/user/verify/${user.id}`, {}, makeHeader());
  return response.data;
};

// ................................................................................

export default {
  login,
  register,
  setToken,
  logout,
  getUnverifiedUsers,
  verifyUser,
  deleteUser,
};
// Path: frontEnd/src/services/userService.js

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
  firstName,
  lastName,
  email,
  password,
  group,
  campus,
  sport,
  phone
) => {
  const response = await axios.post("/register", {
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: password,
    group: group,
    campus: campus,
    sport: sport,
    phone: phone,
  });
  return response.data;
};

const logout = () => {
  window.localStorage.removeItem("urheilupaivakirjaToken");
  window.sessionStorage.removeItem("urheilupaivakirjaToken");
  window.location.href = "/";
};

// Unverified users -------------------------------------------------------------------

const getUnverifiedUsers = async () => {
  await waitToken();
  const response = await axios.get("/user/unverified", makeHeader());
  return response.data;
};

const verifyUser = async (user) => {
  await waitToken();
  const response = await axios.put(`/user/verify`, user.id, makeHeader());
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
};
// Path: frontEnd/src/Services/userService.js

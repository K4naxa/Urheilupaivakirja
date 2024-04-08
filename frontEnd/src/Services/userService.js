import axios from "axios";

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

export default { login, register };
// Path: frontEnd/src/Services/userService.js

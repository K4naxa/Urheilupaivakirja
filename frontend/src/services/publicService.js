import axios from "axios";

// get token from localStorage
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

const getOptions = async () => {
  const response = await axios.get("/public/options");
  return response.data;
};

// User Group Management -----------------------------------------------------------------

const getGroups = async () => {
  const response = await axios.get("/public/groups");
  return response.data;
};

const editGroup = async (group) => {
  const response = await axios.put(
    `/public/groups/${group.id}`,
    group,
    makeHeader()
  );
  return response.data;
};

const deleteGroup = async (id) => {
  const response = await axios.delete(`/public/groups/${id}`, makeHeader());
  return response.data;
};

export default { getOptions, getGroups, editGroup, deleteGroup };

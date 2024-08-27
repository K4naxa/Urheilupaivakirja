import apiClient from './apiClient';

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
/*
const getOptions = async () => {
  const response = await apiClient.get("/public/options");
  return response.data;
};
*/

// User Group Management -----------------------------------------------------------------

/*
const getGroups = async () => {
  const response = await apiClient.get("/public/groups");
  return response.data;
};

const addGroup = async (newGroup) => {
  const group = { name: newGroup };
  const response = await apiClient.post("/public/groups", group);
  return response.data;
};

const editGroup = async (group) => {
  const response = await apiClient.put(
    `/public/groups/${group.id}`,
    group
  );
  return response.data;
};

const deleteGroup = async (id) => {
  const response = await apiClient.delete(`/public/groups/${id}`);
  return response.data;
};

*/
// Campus Management -----------------------------------------------------------------
/*
// get all campuses
const getCampuses = async () => {
  const response = await apiClient.get("/public/campuses");
  return response.data;
};
// add a new campus
const addCampus = async (newCampus) => {
  const campus = { name: newCampus };
  const response = await apiClient.post("/public/campuses", campus);
  return response.data;
};

// edit a campus
const editCampus = async (campus) => {
  const response = await apiClient.put(
    `/public/campuses/${campus.id}`,
    campus
  );
  return response.data;
};

// delete a campus
const deleteCampus = async (id) => {
  const response = await apiClient.delete(`/public/campuses/${id}`);
  return response.data;
};

*/
// ................................................................................

// get all news
/*
const getNews = async () => {
  const response = await apiClient.get("/public/news");
  return response.data;
};

// get unread news count

const checkUnreadNews = async () => {
  const response = await apiClient.get("/public/news/unread");
  return response.data;
};
*/

//TODO: SIIRRÄ OIKEAAN SERVICEEN JA ROUTERIIN

// update student.news_last_viewed_at



// ................................................................................
/*
export default {
  getOptions,
  getGroups,
  editGroup,
  deleteGroup,
  addGroup,
  getCampuses,
  addCampus,
  editCampus,
  deleteCampus,
  getNews,
  checkUnreadNews,
  updateNewsLastViewedAt,
};
*/
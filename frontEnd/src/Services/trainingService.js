import axios from "axios";

// get all sports
const getSports = async () => {
  const response = await axios.get("/sports");
  return response.data;
};

// get a single sport by id
const getSport = async (id) => {
  const response = await axios.get(`/sports/${id}`);
  return response.data;
};

// add a new sport
const addSport = async (sport) => {
  const response = await axios.post("/sports", sport);
  return response.data;
};

// edit a single sport by id
const editSport = async (sport) => {
  const id = sport.id;
  const response = await axios.put(`/sports/${id}`, { name: sport.name });
  return response.data;
};

// delete a single sport by id
const deleteSport = async (id) => {
  const response = await axios.delete(`/sports/${id}`);
  return response.data;
};

export default { getSports, getSport, addSport, editSport, deleteSport };

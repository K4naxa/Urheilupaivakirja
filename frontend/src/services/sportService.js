import apiClient from './apiClient';


//get all sports
const getSports = async () => {
    const response = await apiClient.get("/sport/");
    return response.data;
  };
  
  // get a single sport by id
  const getSport = async (id) => {
    const response = await apiClient.get(`/sport/${id}`);
    return response.data;
  };
  
  // add a new sport
  const addSport = async (sport) => {
    const response = await apiClient.post("/sport", sport);
    return response.data;
  };
  
  // edit a single sport by id
  const editSport = async (sport) => {
    const id = sport.id;
    const response = await apiClient.put(
      `/sport/${id}`,
      { name: sport.name }
    );
    return response.data;
  };
  
  // delete a single sport by id
  const deleteSport = async (id) => {
    const response = await apiClient.delete(`/sport/${id}`);
    return response.data;
  };

  const verifySport = async (sportId) => {
    const response = await apiClient.put(
      `/sport/verify/${sportId}`,
      {}
    );
    return response.data;
  };

export default {
    getSports,
    getSport,
    addSport,
    editSport,
    deleteSport,
    verifySport
}



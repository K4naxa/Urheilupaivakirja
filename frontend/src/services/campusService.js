import apiClient from './apiClient';

// get all campuses
const getCampuses = async () => {
    const response = await apiClient.get("/campus/");
    return response.data;
  };
  // add a new campus
  const addCampus = async (newCampus) => {
    const campus = { name: newCampus };
    const response = await apiClient.post("/campus/", campus);
    return response.data;
  };
  
  // edit a campus
  const editCampus = async (campus) => {
    const response = await apiClient.put(
      `/campus/${campus.id}`,
      campus
    );
    return response.data;
  };
  
  // delete a campus
  const deleteCampus = async (id) => {
    const response = await apiClient.delete(`/campus/${id}`);
    return response.data;
  };
  

export default {
    getCampuses,
    addCampus,
    editCampus,
    deleteCampus
}

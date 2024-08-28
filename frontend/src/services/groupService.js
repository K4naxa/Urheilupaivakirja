import apiClient from "./apiClient";

const getGroups = async () => {
  const response = await apiClient.get("/group/");
  return response.data;
};

const addGroup = async (newGroup) => {
  const group = { name: newGroup };
  const response = await apiClient.post("/group/", group);
  return response.data;
};

const editGroup = async (group) => {
  const response = await apiClient.put(
    `/group/${group.id}`,
    group
  );
  return response.data;
};

const deleteGroup = async (id) => {
  const response = await apiClient.delete(`/group/${id}`);
  return response.data;
};

const verifyStudentGroup = async (studentGroupId) => {
  const response = await apiClient.put(
    `/group/verify/${studentGroupId}`,
    {}
  );
  return response.data;
};

export default {
  getGroups,
  addGroup,
  editGroup,
  deleteGroup,
  verifyStudentGroup,
};

import apiClient from "./apiClient";

// Teacher  Management -------------------------------------------------------------------
const getTeachers = async () => {
  const response = await apiClient.get("/teacher/");
  return response.data;
};

const getInvitedTeachers = async () => {
  const response = await apiClient.get("/teacher/invited");
  return response.data;
};

const registerTeacher = async (data) => {
  const response = await apiClient.post("/teacher/register", {
    token: data.token,
    email: data.email,
    password: data.password,
    first_name: data.firstName,
    last_name: data.lastName,
  });
  return response.data;
};

const inviteTeacher = async (email) => {
  const response = await apiClient.post("/teacher/invite", { email });
  return response.data;
};

const deactivateTeacher = async (id) => {
  const response = await apiClient.put(`/teacher/deactivate/${id}`, {});
  return response.data;
};

const deleteTeacher = async (userId) => {
  const response = await apiClient.delete(`/user/delete/teacher/${userId}`);
  return response.data;
};

const revokeInvitationToken = async (token) => {
  const response = await apiClient.post("/teacher/revoke/:id");
  return response.data;
};

const deleteTeacherUserSelf = async (password) => {
  const response = await apiClient.post("/user/delete/teacher/self", {
    password,
  });
  return response.data;
};

export default {
  getTeachers,
  getInvitedTeachers,
  registerTeacher,
  inviteTeacher,
  deactivateTeacher,
  deleteTeacher,
  revokeInvitationToken,
};

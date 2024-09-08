import apiClient from "./apiClient";

// Spectator  Management -------------------------------------------------------------------
const getSpectators = async () => {
    const response = await apiClient.get("/spectator/");
    return response.data;
  };
  
  const getInvitedSpectators = async () => {
    const response = await apiClient.get("/spectator/invited");
    return response.data;
  };
  
  const registerSpectator = async (data) => {
    const response = await apiClient.post("/spectator/register", {
      token: data.token,
      email: data.email,
      password: data.password,
      first_name: data.firstName,
      last_name: data.lastName,
    });
    return response.data;
  };
  
  const inviteSpectator = async (email) => {
    const response = await apiClient.post(
      "/spectator/invite",
      { email }
    );
    return response.data;
  };

  const revokeInvitationToken = async (id) => {
    const response = await apiClient.delete(
      `/spectator/revoke/${id}`,
      {}
    );
    return response.data;
  }
  
  const deactivateSpectator = async (id) => {
    const response = await apiClient.put(
      `/spectator/deactivate/${id}`,
      {}
    );
    return response.data;
  };

  const deleteSpectator = async (userId) => {
    const response = await apiClient.delete(`/user/delete/${userId}`);
    return response.data;
  };

export default {
    getSpectators,
    getInvitedSpectators,
    registerSpectator,
    inviteSpectator,
    deactivateSpectator,
    deleteSpectator,
    revokeInvitationToken,
};

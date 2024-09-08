import apiClient from "./apiClient";

// Login

const login = async (email, password, stayLoggedIn) => {
  const response = await apiClient.post("/auth/login", {
    email: email,
    password: password,
    stayLoggedIn: stayLoggedIn,
  });
  return response.data;
};

const logout = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
}

const logoutAll = async () => {
  const response = await apiClient.post("/auth/logout/all");
  return response.data;
}

// Password Reset -------------------------------------------------------------------
const requestPasswordReset = async (email) => {
  const response = await apiClient.post("/user/request-password-reset", {
    email,
  });
  return response.data;
};

const verifyPasswordResetOTP = async (email, otp) => {
  const response = await apiClient.post("/user/verify-password-reset", {
    email,
    otp,
  });
  return response.data;
};

const resetPassword = async (email, resetToken, newPassword) => {
  const response = await apiClient.post("/user/reset-password", {
    email,
    resetToken,
    password: newPassword,
  });
  return response.data;
};

const changePassword = async (oldPassword, newPassword) => {
  const response = await apiClient.put("/user/change-password", {
    oldPassword,
    password: newPassword,
  });
  return response.data;
}

const verifyPassword = async (password) => {
  const response = await apiClient.post(
    "/user/verify-password",
    { password }
  );
  if (response.status === 200) {
    return true;
  }
};

// Delete user -------------------------------------------------------------------
const deleteUserSelf = async (password) => {
  const response = await apiClient.post(
    "/user/delete/self",
    { password }
  );
  return response.data;
};

// Profile Data -------------------------------------------------------------------
const getProfileData = async () => {
  const response = await apiClient.get(`/user/profile`);
  return response.data;
};

export default {
  login,
  requestPasswordReset,
  verifyPasswordResetOTP,
  changePassword,
  resetPassword,
  verifyPassword,
  deleteUserSelf,
  getProfileData,
  logout,
  logoutAll,
};

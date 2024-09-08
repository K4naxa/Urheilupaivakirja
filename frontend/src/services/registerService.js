import apiClient from "./apiClient";

// Register -------------------------------------------------------------------
const register = async (
  email,
  password,
  firstName,
  lastName,
  sportId,
  groupId,
  campusId
) => {
  const response = await apiClient.post("/register/", {
    email: email,
    password: password,
    first_name: firstName,
    last_name: lastName,
    sport_id: sportId,
    group_id: groupId,
    campus_id: campusId,
  });
  return response.data;
};

// get all dropdown options for registration form (student groups, sports, campuses)

// create email verification OTP and send it to the user's email
const createEmailVerificationOTP = async () => {
  const response = await apiClient.post(
    "/register/new-email-verification",
    null
  );
  return response.data;
};

// send email verification OTP taken from the email back to the server for verification
const sendEmailVerificationOTP = async (otp) => {
  const response = await apiClient.post(
    "/register/verify-email",
    { otp }
  );
  return response.data;
};

const checkIfOTPExists = async () => {
  const response = await apiClient.get("/register/check-for-otp");
  return response.data.value;
};

export default {
  register,
  createEmailVerificationOTP,
  sendEmailVerificationOTP,
  checkIfOTPExists
};

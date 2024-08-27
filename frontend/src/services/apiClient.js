import axios from "axios";
// Axios instance for API requests
const apiClient = axios.create({
  withCredentials: true, // Send cookies with requests
});

// Response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
  
      // Check if the error is due to an expired access token specifically
      if (
        error.response &&
        error.response.status === 401 &&
        !originalRequest._retry
      ) {
        const errorMessage = error.response.data.message || "";
  
        // If the error message specifically indicates an expired token
        if (
          errorMessage === "Access token not found" ||
          errorMessage === "Invalid or expired access token"
        ) {
            console.log(errorMessage);
          originalRequest._retry = true; // Avoids infinite loop
  
          try {
            // Attempt to refresh the access token
            const { data } = await axios.post(
              "/auth/refresh-access-token",
              {},
              { withCredentials: true }
            );
                
            console.log ("New access token received: ", data.accessToken);
            // Retry the original request with the new access token automatically sent via cookie
            return apiClient(originalRequest); // Retry the original request
          } catch (refreshError) {
            // If refreshing the token fails, avoid retrying
            console.log("Refresh token expired or invalid, redirecting to login");
            window.location.href = "/kirjaudu-ulos"; 
            return Promise.reject(refreshError);
          }
        }
      }
  
      // If the error is not due to an expired token, or if retry fails, reject the promise
      return Promise.reject(error);
    }
  );

export default apiClient;

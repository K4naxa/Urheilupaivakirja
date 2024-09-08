import axios from "axios";

// Axios instance for API requests
const apiClient = axios.create({
  withCredentials: true, // Send cookies with requests
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      const errorMessage = error.response.data.message || "";

      if (
        errorMessage === "Access token missing" ||
        errorMessage === "Invalid or expired access token"
      ) {
        if (isRefreshing) {
          // If a refresh is already in progress, push the request to the queue
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
          .then((token) => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const { data } = await axios.post(
            "/auth/refresh-access-token",
            {},
            { withCredentials: true }
          );

          console.log("New access token received: ", data.accessToken);

          processQueue(null, data.accessToken);

          // Retry the original request with the new token
          originalRequest.headers['Authorization'] = `Bearer ${data.accessToken}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          console.log("Refresh token expired or invalid, redirecting to login");
          window.location.href = "/kirjaudu-ulos";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

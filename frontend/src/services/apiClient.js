import axios from 'axios';

// Axios instance for API requests
const apiClient = axios.create({
  withCredentials: true, // Send cookies with requests
});

let isRefreshing = false;
let failedQueue = [];

// Function to process the queue of failed requests
const processQueue = (error) => {
  console.log('Processing queue. Current failedQueue:', failedQueue);

  failedQueue.forEach((prom, index) => {
    if (error) {
      console.log(`Rejecting request ${index + 1} due to error:`, error);
      prom.reject(error);
    } else {
      console.log(`Resolving request ${index + 1}`);
      prom.resolve();
    }
  });

  // After processing, clear the queue
  console.log('Clearing failedQueue after processing.');
  failedQueue = [];
  console.log('Failed queue cleared:', failedQueue);
};

// Function to reset Axios interceptors and clear the failed request queue
export const resetAxiosInstance = () => {
  // Eject the interceptor using the stored ID
  apiClient.interceptors.response.eject(responseInterceptorId);

  // Clear the queue of failed requests
  failedQueue = [];
  console.log('Axios instance reset. Failed queue cleared.');
};

// Request interceptor to queue requests during token refresh
apiClient.interceptors.request.use(
  (config) => {
    if (isRefreshing) {
      console.log('Token is refreshing, queueing request:', config.url);
      return new Promise((resolve, reject) => {
        failedQueue.push({ config, resolve, reject });
      });
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Store the interceptor ID when adding the response interceptor
const responseInterceptorId = apiClient.interceptors.response.use(

  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if the original request has already been retried
    if (originalRequest._retry) {
      console.log('Original request has already been retried.');
      return Promise.reject(error);
    }

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      const errorMessage = error.response.data.message || "";

      // Handle specific token-related errors
      if (errorMessage === "No tokens provided") {
        window.location.href = "/kirjaudu-ulos";
        return Promise.reject(error);
      }

      if (
        errorMessage.includes('Access token missing') ||
        errorMessage.includes('Invalid or expired access token')
      ) {
        // If a token refresh is already in progress, queue the request
        if (isRefreshing) {
          console.log(
            'Token refresh in progress. Adding request to failedQueue:',
            originalRequest.url
          );

          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
            console.log('Updated failedQueue:', failedQueue);
          })
            .then(() => {
              // Retry the original request after token is refreshed
              return apiClient(originalRequest);
            })
            .catch((err) => {
              return Promise.reject(err);
            });
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          // Request to refresh the access token
          await axios.post(
            "/auth/refresh-access-token",
            {},
            { withCredentials: true }
          );

          console.log("Access token refreshed successfully");

          processQueue(null); // Resolve all queued requests

          // Retry the original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError); // Reject all queued requests

          console.log(
            "Refresh token expired or invalid, redirecting to login"
          );

          window.location.href = "/kirjaudu-ulos";
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false; // Reset the refreshing flag
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
